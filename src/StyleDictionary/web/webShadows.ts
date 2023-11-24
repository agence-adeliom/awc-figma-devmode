import tinycolor from 'tinycolor2'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-shadow' && token.value !== 0
  },
  transformer: function ({ value }) {
    return `${value.shadowType === 'innerShadow' ? 'inset ' : ''}${value.offsetX}px ${value.offsetY}px ${value.radius}px ${value.spread}px ${tinycolor(value.color).toRgbString()}`
  }
}
