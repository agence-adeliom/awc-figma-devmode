import tinycolor from "tinycolor2"

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value }) {
    return `${tinycolor(value).toRgbString()}`
  }
}
