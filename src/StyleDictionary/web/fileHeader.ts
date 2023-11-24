const defaultFileHeader = (arr) => arr

const lineSeparator = '\n'
const defaultFormatting = {
  lineSeparator,
  prefix: ' * ',
  header: `/**${lineSeparator}`,
  footer: `${lineSeparator} */${lineSeparator}${lineSeparator}`
}

const fileHeader = ({ file = {}, commentStyle, formatting = {} }: { file?: any, commentStyle?: string, formatting?: any }) => {
  let showFileHeader = true
  if (file.options && typeof file.options.showFileHeader !== 'undefined') {
    showFileHeader = file.options.showFileHeader
  }

  if (!showFileHeader) return ''

  let fn = defaultFileHeader
  if (file.options && typeof file.options.fileHeader === 'function') {
    fn = file.options.fileHeader
  }

  const defaultHeader = [
    'Do not edit directly',
    `Generated on ${new Date().toString()}`
  ]

  let { prefix, lineSeparator, header, footer } = Object.assign({}, defaultFormatting, formatting)

  if (commentStyle === 'short') {
    prefix = '// '
    header = `${lineSeparator}`
    footer = `${lineSeparator}${lineSeparator}`
  } else if (commentStyle === 'xml') {
    prefix = '  '
    header = `<!--${lineSeparator}`
    footer = `${lineSeparator}-->`
  }

  return `${header}${fn(defaultHeader)
    .map(line => `${prefix}${line}`)
    .join(lineSeparator)}${footer}`
}

export default fileHeader
