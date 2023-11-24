import _ from 'lodash';
import { tokenTypes } from './tokenTypes'
import config from './config'
import { roundRgba } from './convertColor'
import { changeNotation, slugify } from './changeNotation'
import { getVariableTypeByValue } from './getVariableTypeByValue'
import roundWithDecimals from './roundWithDecimals'
import { prefixTokenName } from './prefixTokenName'
import { groupByKeyAndName } from './groupByName'
import type { internalTokenInterface, tokenCategoryType, tokenExportKeyType, PropertyType } from '../types'

import { transformer as originalFormatTransformer } from '../transformer/originalFormatTransformer'
import { transformer as standardTransformer } from '../transformer/standardTransformer'

const tokenTransformer = {
    original: originalFormatTransformer,
    standard: standardTransformer,
    standardDeprecated: standardTransformer
}

export const exportRawTokenArray = (figma: PluginAPI) => {
  // get tokens
  return prepareExport([
    ...getVariables(figma)
  ])
}

export const getVariables = (figma: PluginAPI): internalTokenInterface[] => {
  
  const excludedCollectionIds = figma.variables.getLocalVariableCollections().filter(collection => !['.', '_', ...config.exclusionPrefix].includes(collection.name.charAt(0))).map(collection => collection.id);
  // get collections
  const collections = Object.fromEntries(figma.variables.getLocalVariableCollections().map((collection) => [collection.id, collection]))

  // get variables
  const variables = figma.variables.getLocalVariables().filter(variable => excludedCollectionIds.includes(variable.variableCollectionId)).map((variable) => {
    // get collection name and modes
    const { variableCollectionId } = variable
    const { name: collection, modes } = collections[variableCollectionId]
    // return each mode value as a separate variable
    return Object.entries(variable.valuesByMode).map(([id, value]) => {
      return {
        ...extractVariable(variable, value),
        // name is contstructed from collection, mode and variable name
        name: config.modeReference ? `${slugify(collection)}/${modes.find(({ modeId }) => modeId === id).name}/${variable.name}` : `${slugify(collection)}/${variable.name}`,
        // add mnetadata to extensions
        extensions: {
          [config.key.extensionPluginData]: {
            mode: config.modeReference ? modes.find(({ modeId }) => modeId === id).name : undefined,
            collection: collection,
            scopes: variable.scopes,
            [config.key.extensionVariableStyleId]: variable.id,
            exportKey: tokenTypes.variables.key as tokenExportKeyType
          }
        }
      }
    })
  })


  return config.modeReference ? processAliasModes((variables.flat())) : variables.flat();
}

const extractVariable = (variable, value) => {
  let category: tokenCategoryType = 'color'
  let values = {}
  if (value.type === 'VARIABLE_ALIAS') {
    const resolvedAlias = figma.variables.getVariableById(value.id)
    const collection = figma.variables.getVariableCollectionById(resolvedAlias.variableCollectionId)

    return {
      name: variable.name,
      description: variable.description || undefined,
      exportKey: tokenTypes.variables.key as tokenExportKeyType,
      category: getVariableTypeByValue(Object.values(resolvedAlias.valuesByMode)[0]),
      values: `{${slugify(collection.name)}.${changeNotation(resolvedAlias.name, '/', '.')}}`,

      // this is being stored so we can properly update the design tokens later to account for all 
      // modes when using aliases
      aliasName: slugify(collection.name),
      aliasModes: collection.modes
    }
  }
  switch (variable.resolvedType) {
    case 'COLOR':
      category = 'color'
      values = {
        fill: {
          value: roundRgba(value),
          type: 'color' as PropertyType,
          blendMode: 'normal'
        }
      }
      break
    case 'FLOAT':
      category = 'dimension'
      values = roundWithDecimals(value, 2)
      break
    case 'STRING':
      category = 'string'
      values = value
      break
    case 'BOOLEAN':
      category = 'boolean'
      values = value
      break
  }
  return {
    name: variable.name,
    description: variable.description || undefined,
    exportKey: tokenTypes.variables.key as tokenExportKeyType,
    category,
    values
  }
}

const processAliasModes = (variables) => {
  return variables.reduce((collector, variable) => {
    // nothing needs to be done to variables that have no alias modes
    if (!variable.aliasModes) {
      collector.push(variable)
      return collector
    }

    const { aliasModes, aliasName } = variable

    delete variable.aliasModes
    delete variable.selfCollectionName

    for (let i = 0; i < aliasModes.length; i++) {
      const modeBasedVariable = { ...variable }
      const nameParts = modeBasedVariable.name.split('/');
      
      if(nameParts.includes(aliasModes[i].name)){
        modeBasedVariable.values = modeBasedVariable.values.replace(`{${aliasName}.`, `{${aliasName}.${aliasModes[i].name}.`)        
        modeBasedVariable.name = nameParts.join('/')
        collector.push(modeBasedVariable)
      }
    }

    return collector
  }, [])
}

export const prepareExport = (tokenArray: internalTokenInterface[]) => {
    // filter by user setting for export keys
    const tokensFiltered: internalTokenInterface[] = tokenArray.filter(({ exportKey }) => config.exports[exportKey])
    // add to name
    const prefixedTokens = prefixTokenName(tokensFiltered)
    // converted values
    const tokensConverted = prefixedTokens.map(token => tokenTransformer[config.tokenFormat](token, config)).filter(Boolean)
    // group items by their names
    // @ts-ignore
    const tokensGroupedByName = groupByKeyAndName(tokensConverted, config)
    // return tokens
    return tokensGroupedByName
}

export const normalizeValues = (value: string | number) => {
  if (typeof value === "number") {
      return value + "";
  }

  return value;
};

export const formatVariable = (key: string, value: string) => {
  const format = "scss";
  switch (format) {
      case "stylus":
          return `${key} = ${value.replace("$", "")};`;
      case "sass":
          return `$${key}: ${value}`;
      case "scss":
          return `$${key}: ${value};`;
      case "less":
          return `@${key}: ${value.replace("$", "@")};`;
      default:
          throw new Error("Unknown variable format");
  }
};

export const toString = (token: string, prop: string | number) => {
  let tokens: string[] = [];

  if (typeof prop === "string" || typeof prop === "number") {
      tokens.push(formatVariable(token, normalizeValues(prop)));
  } else if (typeof prop === "object") {      
      tokens = tokens.concat(
          [].concat(
              // @ts-ignore
              ...Object.entries(prop).map(([key, value]: [string, string]) => {
                  const prevStr = token ? `${token}--` : "";
                  if(key == "key"){
                    return toString(`${prevStr}${key}`, normalizeValues(value));
                  }
              })
          )
      );
  }

  return tokens.join('\n');
};