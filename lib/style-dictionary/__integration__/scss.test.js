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
const scss = require("sass");
const StyleDictionary = require("../index");
const { buildPath } = require("./_constants");

describe(`integration`, () => {
  describe(`scss`, () => {
    StyleDictionary.extend({
      source: helper.getTokens([`./__integration__/tokens/**/*.json`]),
      platforms: {
        css: {
          transformGroup: `scss`,
          buildPath,
          files: [
            {
              destination: `variables.scss`,
              format: `scss/variables`,
            },
            {
              destination: `variables-themeable.scss`,
              format: `scss/variables`,
              options: {
                themeable: true,
              },
            },
            {
              destination: `variables-with-references.scss`,
              format: `scss/variables`,
              options: {
                outputReferences: true,
              },
            },
            {
              destination: `filtered-variables-with-references.scss`,
              format: `scss/variables`,
              filter: (token) => token.path[1] === "background",
              options: {
                outputReferences: true,
              },
            },
            {
              destination: `map-flat.scss`,
              format: `scss/map-flat`,
              mapName: "design-system-tokens",
            },
            {
              destination: `map-deep.scss`,
              format: `scss/map-deep`,
              mapName: "design-system-tokens",
            },
            {
              destination: `map-deep-with-references.scss`,
              format: `scss/map-deep`,
              mapName: "design-system-tokens",
              options: {
                outputReferences: true,
              },
            },
            {
              destination: `map-deep-not-themeable.scss`,
              format: `scss/map-deep`,
              mapName: "design-system-tokens",
              options: {
                themeable: false,
              },
            },
          ],
        },
      },
    }).buildAllPlatforms();

    describe(`scss/variables`, () => {
      const output = fs.get(`${buildPath}variables.scss`);

      it(`should have a valid scss syntax`, () => {
        const result = scss.compileString(output);
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with themeable`, () => {
        const output = fs.get(`${buildPath}variables-themeable.scss`);
        it(`should have a valid scss syntax`, () => {
          const result = scss.compileString(output);
          expect(result.css).toBeDefined();
        });

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      describe(`with outputReferences`, () => {
        const output = fs.get(`${buildPath}variables-with-references.scss`);
        it(`should have a valid scss syntax`, () => {
          const result = scss.compileString(output);
          expect(result.css).toBeDefined();
        });

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      describe(`with filter and output references`, () => {
        const output = fs.get(`${buildPath}filtered-variables-with-references.scss`);
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });
    });

    describe(`scss/map-flat`, () => {
      const output = fs.get(`${buildPath}map-flat.scss`);

      it(`should have a valid scss syntax`, () => {
        const result = scss.compileString(output);
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });
    });

    describe(`scss/map-deep`, () => {
      const output = fs.get(`${buildPath}map-deep.scss`);

      it(`should have a valid scss syntax`, () => {
        const result = scss.compileString(output);
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with outputReferences`, () => {
        const output = fs.get(`${buildPath}map-deep-with-references.scss`);
        it(`should have a valid scss syntax`, () => {
          const result = scss.compileString(output);
          expect(result.css).toBeDefined();
        });

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      describe(`without themeable`, () => {
        const output = fs.get(`${buildPath}map-deep-not-themeable.scss`);
        it(`should have a valid scss syntax`, () => {
          const result = scss.compileString(output);
          expect(result.css).toBeDefined();
        });

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });
    });
  });
});

afterAll(() => {
  fs.rm(buildPath);
});
