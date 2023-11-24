import { ColorRgba } from '../types'
import roundWithDecimals from './roundWithDecimals'
import tinycolor from 'tinycolor2'

export const roundRgba = (rgba: {
    r: number,
    g: number,
    b: number,
    a?: number,
  }, opacity?: number): ColorRgba => ({
  r: roundWithDecimals(rgba.r * 255, 0) ?? 0,
  g: roundWithDecimals(rgba.g * 255, 0) ?? 0,
  b: roundWithDecimals(rgba.b * 255, 0) ?? 0,
  a: roundWithDecimals(opacity ?? rgba.a ?? 1) ?? 1
})

export const convertPaintToRgba = (paint): ColorRgba|null => {
  if (paint.type === 'SOLID' && paint.visible === true) {
    return roundRgba(paint.color, paint.opacity)
  }
  return null
}

export const convertRgbaObjectToString = (rgbaObject: ColorRgba): string => `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`

export const rgbaObjectToColor = (rgbaObject: ColorRgba): string => {
  // return value
  if(rgbaObject.a == 1){
    return tinycolor(convertRgbaObjectToString(rgbaObject)).toHexString()
  }
  return convertRgbaObjectToString(rgbaObject)
}