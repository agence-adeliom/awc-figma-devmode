import createPropertyFormatter from './createPropertyFormatter'
import sortByReference from './sortByReference'

const defaultFormatting = {
  lineSeparator: '\n'
}

const formattedVariables = ({ format, dictionary, outputReferences = false, formatting = {} }) => {
  let { allTokens } = dictionary
  const { lineSeparator } = Object.assign({}, defaultFormatting, formatting)

  if (outputReferences) {
    allTokens = [...allTokens].sort(sortByReference(dictionary))
  }

  return allTokens
    .map(createPropertyFormatter({ outputReferences, dictionary, format, formatting }))
    .filter(function (strVal) { return !!strVal })
    .join(lineSeparator)
}

export default formattedVariables
