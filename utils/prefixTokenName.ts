import config from './config'
import { StandardTokenInterface, OriginalFormatTokenInterface } from '../types'

const getExportKey = (token: OriginalFormatTokenInterface | StandardTokenInterface) => {
  // standard token
  if (token.extensions?.[config.key.extensionPluginData]?.exportKey !== undefined) {
    return token.extensions[config.key.extensionPluginData].exportKey
  }
  return 'missingExportKey'
}

export const prefixTokenName = (tokenArray: OriginalFormatTokenInterface[] | StandardTokenInterface[]) => {
  // guard
  if (tokenArray.length <= 0) return []
  // nest tokens into object with hierarchy defined by name using /
  return tokenArray.map(token => {
    // remove top level prefix from name if desired
    if (config.prefixInName === false) {
      token.name = token.name.substr(token.name.indexOf('/') + 1).trim().trimLeft()
    } else {
      if (token.extensions?.[config.key.extensionPluginData]?.alias !== undefined) {
        const prefix = token.name.substr(0, token.name.indexOf('/')).trim().trimLeft()
        token.extensions[config.key.extensionPluginData].alias = `${prefix}.${token.extensions[config.key.extensionPluginData].alias}`
      }
    }
    // add key to name if desired
    if (config.keyInName) {
      token.name = `${getExportKey(token)}/${token.name}`
      // add exportKey to token
      if (token.extensions?.[config.key.extensionPluginData]?.alias !== undefined) {
        token.extensions[config.key.extensionPluginData].alias = `${getExportKey(token)}.${token.extensions[config.key.extensionPluginData].alias}`
      }
    }

    return token
  })
}