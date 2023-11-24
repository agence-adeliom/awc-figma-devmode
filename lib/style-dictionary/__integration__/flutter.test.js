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

const { fs } = require("../lib/utils/store");
const helper = require("../__tests__/__helpers");
const StyleDictionary = require("../index");
const { buildPath } = require("./_constants");

describe("integration", () => {
  describe("flutter", () => {
    StyleDictionary.extend({
      source: helper.getTokens([`./__integration__/tokens/**/*.json`]),
      platforms: {
        flutter: {
          transformGroup: `flutter`,
          buildPath,
          files: [
            {
              destination: "style_dictionary.dart",
              format: "flutter/class.dart",
              className: "StyleDictionary",
            },
            {
              destination: "style_dictionary_with_references.dart",
              format: "flutter/class.dart",
              className: "StyleDictionary",
              options: {
                outputReferences: true,
              },
            },
          ],
        },
        flutter_separate: {
          transformGroup: `flutter-separate`,
          buildPath,
          files: [
            {
              destination: "style_dictionary_color.dart",
              format: "flutter/class.dart",
              className: "StyleDictionaryColor",
              type: "color",
              filter: {
                attributes: {
                  category: "color",
                },
              },
            },
            {
              destination: "style_dictionary_sizes.dart",
              format: "flutter/class.dart",
              className: "StyleDictionarySize",
              type: "float",
              filter: {
                attributes: {
                  category: "size",
                },
              },
            },
          ],
        },
      },
    }).buildAllPlatforms();

    describe(`flutter/class.dart`, () => {
      const output = fs.get(`${buildPath}style_dictionary.dart`);

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.get(`${buildPath}style_dictionary_with_references.dart`);

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      describe(`separate`, () => {
        const output = fs.get(`${buildPath}style_dictionary_color.dart`);
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });
    });
  });
});

afterAll(() => {
  fs.rm(buildPath)
});
