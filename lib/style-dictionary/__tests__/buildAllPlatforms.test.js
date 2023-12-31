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
var helpers = require("./__helpers");
var StyleDictionary = require("../index");

describe("buildAllPlatforms", () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it("should work with config", () => {
    var StyleDictionaryExtended = StyleDictionary.extend(
      helpers.getBaseConfig()
    );
    StyleDictionaryExtended.buildAllPlatforms();
    expect(
      fs.get("/__tests__/__output/web/_icons.css")
    ).toBeTruthy();
    expect(
      fs.get("/__tests__/__output/android/colors.xml")
    ).toBeTruthy();
  });
});
