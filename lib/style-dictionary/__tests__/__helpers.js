/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var fsExtra = require('fs-extra');
var { globSync } = require('glob');

module.exports = {
  clearOutput: function () {
    fsExtra.emptyDirSync('__tests__/__output');
  },

  fileToJSON: function (path) {
    return fsExtra.readJsonSync(path);
  },

  fileExists: function (filePath) {
    try {
      return fsExtra.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  pathDoesNotExist: function (path) {
    try {
      return !fsExtra.existsSync(path);
    } catch (err) {
      return false;
    }
  },

  dirDoesNotExist: function (dirPath) {
    return this.pathDoesNotExist(dirPath);
  },

  fileDoesNotExist: function (filePath) {
    return this.pathDoesNotExist(filePath);
  },

  getTokens: function (patterns) {
    let arr = [];

    for (var pattern in patterns) {
      arr = arr.concat(globSync(patterns[pattern]).sort().map((file) => this.fileToJSON(file)));
    }

    return arr;
  },

  getBaseConfig: function () {
    return {
      source: this.getTokens(["./__tests__/__properties/**/*.json"]),
      platforms: {
        web: {
          transformGroup: "web",
          prefix: "smop",
          buildPath: "/__tests__/__output/web/",
          files: [
            {
              destination: "_icons.css",
              format: "scss/icons",
            },
            {
              destination: "_variables.css",
              format: "scss/variables",
            },
            {
              destination: "_styles.js",
              format: "javascript/module",
            },
          ],
        },
        scss: {
          transformGroup: "scss",
          prefix: "smop",
          buildPath: "/__tests__/__output/scss/",
          files: [
            {
              destination: "_icons.scss",
              format: "scss/icons",
            },
            {
              destination: "_variables.scss",
              format: "scss/variables",
            },
          ],
        },
        less: {
          transformGroup: "less",
          prefix: "smop",
          buildPath: "/__tests__/__output/less/",
          files: [
            {
              destination: "_icons.less",
              format: "less/icons",
            },
            {
              destination: "_variables.less",
              format: "less/variables",
            },
          ],
        },
        android: {
          transformGroup: "android",
          buildPath: "/__tests__/__output/",
          files: [
            {
              destination: "android/colors.xml",
              format: "android/colors",
            },
            {
              destination: "android/font_dimen.xml",
              format: "android/fontDimens",
            },
            {
              destination: "android/dimens.xml",
              format: "android/dimens",
            },
          ],
          actions: [],
        },
        ios: {
          transformGroup: "ios",
          buildPath: "/__tests__/__output/ios/",
          files: [
            {
              destination: "style_dictionary.plist",
              format: "ios/plist",
            },
            {
              destination: "style_dictionary.h",
              format: "ios/macros",
            },
          ],
        },
        "react-native": {
          transformGroup: "react-native",
          buildPath: "/__tests__/__output/react-native/",
          files: [
            {
              destination: "style_dictionary.js",
              format: "javascript/es6",
            },
          ],
        },
      },
    };
  },
};
