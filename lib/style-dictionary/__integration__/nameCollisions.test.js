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
const StyleDictionary = require("../index");
const { buildPath } = require("./_constants");

const properties = {
  color: {
    red: { value: "#f00" },
    background: {
      red: { value: "{color.red.value}" },
    },
  },
};

const warn = jest.spyOn(console, "warn");

describe("integration", () => {
  // before each test clear the mocked console.log and the output array
  beforeEach(() => {
    warn.mockClear();
  });

  describe("name collisions", () => {
    it(`should warn users of name collisions for flat files`, () => {
      console.log = jest.fn();
      StyleDictionary.extend({
        // we are only testing name collision warnings options so we don't need
        // the full source.
        properties,
        platforms: {
          web: {
            buildPath,
            files: [
              {
                destination: "variables.css",
                format: "css/variables",
              },
            ],
          },
        },
      }).buildAllPlatforms();
      expect(console.warn).toHaveBeenCalledWith(`⚠️ ${buildPath}variables.css`);
    });

    it(`should not warn users of name collisions for nested files`, () => {
      console.log = jest.fn();
      StyleDictionary.extend({
        // we are only testing name collision warnings options so we don't need
        // the full source.
        properties,
        platforms: {
          web: {
            buildPath,
            files: [
              {
                destination: "tokens.json",
                format: "json/nested",
              },
            ],
          },
        },
      }).buildAllPlatforms();
      expect(console.log).toHaveBeenCalledWith(`✔︎ ${buildPath}tokens.json`);
    });
  });
});

afterAll(() => {
  fs.rm(buildPath)
});
