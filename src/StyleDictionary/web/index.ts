import StyleDictionary from "style-dictionary";

import webShadows from './webShadows'
import webRadius from './webRadius'
import webPadding from './webPadding'
import webFont from './webFont'
import webGradient from './webGradient'
import colorToRgbaString from '../common/colorToRgbaString'

export default {
  transform: {
    'web/shadow': webShadows,
    'web/radius': webRadius,
    'web/padding': webPadding,
    'web/font': webFont,
    'web/gradient': webGradient,
    'color/hex8ToRgba': colorToRgbaString
  },
  transformGroup: {
    'figma/css': [
      'attribute/cti',
      'name/cti/kebab',
      'time/seconds',
      'content/icon',
      'color/css',
      'size/figma',
      'web/shadow',
      'web/radius',
      'web/padding',
      'web/font',
      'web/gradient',
      'color/hex8ToRgba'
    ]
  },
  format: {},
  action: {}
}
