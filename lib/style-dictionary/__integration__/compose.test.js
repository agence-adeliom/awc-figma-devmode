/*
 * Copyright Target Corporation. All Rights Reserved.
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
  describe("compose", () => {
    StyleDictionary.extend({
      source: helper.getTokens([`./__integration__/tokens/**/*.json`]),
      platforms: {
        compose: {
          transformGroup: `compose`,
          buildPath,
          files: [
            {
              destination: "StyleDictionary.kt",
              format: "compose/object",
              className: "StyleDictionary",
              packageName: "com.example.tokens",
            },
            {
              destination: "StyleDictionaryWithReferences.kt",
              format: "compose/object",
              className: "StyleDictionary",
              packageName: "com.example.tokens",
              options: {
                outputReferences: true,
              },
            },
          ],
        },
      },
    }).buildAllPlatforms();

    describe(`compose/object`, () => {
      const output = fs.get(`${buildPath}StyleDictionary.kt`);

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.get(`${buildPath}StyleDictionaryWithReferences.kt`);

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
