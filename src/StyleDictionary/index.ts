import StyleDictionary from "style-dictionary";
const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const remFontBase = 16;

function isSize(token) {
  const sizes = [
    "font-size",
    "spacing",
    "padding",
    "size",
    "width",
    "height",
    "border-radius",
    "border-width",
    "breakpoint",
    "offset",
  ]
  return token.path.some(r => sizes.includes(r)) && token.type === 'number';
}

StyleDictionary.registerTransform({
  name: 'size/figma',
  type: 'value',
  matcher: token => {
    return isSize(token) && token.value !== 0
  },
  transformer: (token, options) => {
    const outputOptions = options.files[0].options;
    if(outputOptions.unit == "PIXEL"){
      return `${token.value}px`
    }else if(outputOptions.unit == "SCALED"){
      return `${token.value / outputOptions.basePxFontSize}rem`
    }else{
      return `${token.value}`
    }
  }
})

StyleDictionary.registerFormat({
  name: 'css/awc-format',
  formatter: function({dictionary, file, options}) {
    const { outputReferences, colorScheme } = options;
    let root = ":root";
    if(colorScheme === "light"){
      root = `:root, \n:host, \n.awc-theme-light, \n:is([data-mode='dark'] .dark\\:awc-theme-light), \n[data-mode='light']`;
    }else if(colorScheme === "dark"){
      root = `:host, \n.awc-theme-dark, \n:is([data-mode='light'] .dark\\:awc-theme-dark), \n[data-mode='dark']`;
    }

    return `
${fileHeader({file})}
${root} {
  color-scheme: ${colorScheme};

${formattedVariables({format: 'css', dictionary, outputReferences})}
}

.awc-scroll-lock {
  padding-right: var(--awc-scroll-lock-size) !important;
  overflow: hidden !important;
}

.awc-toast-stack {
  position: fixed;
  top: 0;
  inset-inline-end: 0;
  z-index: var(--awc-z-index-toast);
  width: 28rem;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}

.awc-toast-stack awc-alert {
  margin: var(--awc-spacing-medium);
}

.awc-toast-stack awc-alert::part(base) {
  box-shadow: var(--awc-shadow-large);
}`.trim();
  }
})

StyleDictionary.registerFilter({
  name: 'validToken',
  matcher: function (token) {
    return [
      "color",
      "number",
      "string"
    ].includes(token.type);
  }
})

export default StyleDictionary