import { VariableMode } from "@typing/Figma";
import { rgbToHex } from "./colors";

export const exportToJSON = (id: string, mode: string) => {
  const collection = figma.variables.getVariableCollectionById(id);
  return processCollection(collection, mode);
};

export const processCollection = ({ name, modes, variableIds }: VariableCollection, modeId: string) => {
  const mode: VariableMode = modes.find((m) => m.modeId ==modeId )

  const body = {};

  variableIds.forEach((variableId) => {

    const { name, resolvedType, valuesByMode } = figma.variables.getVariableById(variableId) ?? {};

    if (valuesByMode && resolvedType && valuesByMode[mode.modeId] !== undefined) {

      const value = valuesByMode[mode.modeId];
      let obj: any = body;
      name.split("/").forEach((groupName: string) => {
        obj[groupName] = obj[groupName] || {};
        obj = obj[groupName];
      });

      switch (resolvedType) {
        case 'COLOR':
          obj.type = 'color';
          break;
        case 'FLOAT':
          obj.type = 'number';
          break;
        case 'BOOLEAN':
          obj.type = 'boolean';
          break;
        case 'STRING':
        default:
          obj.type = 'string';
          break;
      }

      if (value.hasOwnProperty('type')) {
        if((value as VariableAlias).type === "VARIABLE_ALIAS"){
          let variable = null;
          if(variable = figma.variables.getVariableById((value as VariableAlias).id)){
            obj.value = `{${variable.name.replace(/\//g, ".")}}`;
          }
        }
      }else{
        switch (resolvedType) {
          case 'COLOR':
            obj.value = rgbToHex(value as RGBA);
            break;
          case 'FLOAT':
            obj.value = value;
            break;
          case 'BOOLEAN':
            obj.value = !!value;
            break;
          case 'STRING':
          default:
            obj.value = value;
            break;
        }
      }
    }
  });


  return body;
};
