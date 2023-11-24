import tinycolor from 'tinycolor2'

export default {
  type: 'value',
  matcher: function (token) {
    return token.type === 'custom-gradient'
  },
  transformer: function ({ value }) {
    const stopsString = value.stops.map(stop => {
      return `${tinycolor(stop.color).toRgbString()} ${stop.position * 100}%`
    }).join(', ')
    if (value.gradientType === 'linear') {
      return `linear-gradient(${value.rotation}deg, ${stopsString})`
    }
    if (value.gradientType === 'radial') {
      return `radial-gradient(${stopsString})`
    }
  }
}
