/* istanbul ignore file */
export default {
    key: {
      lastVersionSettingsOpened: 'lastVersionSettingsOpened',
      fileId: 'fileId',
      settings: 'settings',
      extensionPluginData: 'com.adeliom.awcTokens',
      extensionFigmaStyleId: 'styleId',
      extensionVariableStyleId: 'variableId',
      extensionAlias: 'alias',
    },
    exclusionPrefix: [],
    modeReference: true,
    nameConversion: 'default',
    keyInName: true,
    prefixInName: true,
    tokenFormat: 'standard',
    fileExtensions: [
      {
        label: '.tokens.json',
        value: '.tokens.json'
      },
      {
        label: '.tokens',
        value: '.tokens'
      },
      {
        label: '.json',
        value: '.json'
      }
    ],
    exports: {
        color: true,
        gradient: true,
        font: true,
        typography: true,
        effect: true,
        grid: true,
        border: true,
        breakpoint: true,
        radius: true,
        size: true,
        spacing: true,
        motion: true,
        opacity: true,
        variables: true
      }
  }