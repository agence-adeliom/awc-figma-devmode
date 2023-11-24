import { internalTokenInterface, StandardTokenExtensionsInterface} from '../types'

export const tokenExtensions = (token: internalTokenInterface, { excludeExtensionProp }): { extensions: StandardTokenExtensionsInterface; } => {
  if (excludeExtensionProp !== true) {
    return {
      extensions: {
        ...token.extensions
      }
    }
  }
}
