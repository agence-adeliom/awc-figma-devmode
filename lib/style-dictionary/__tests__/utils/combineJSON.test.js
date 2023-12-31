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

var combineJSON = require("../../lib/utils/combineJSON");
var helpers = require("../__helpers");

describe("utils", () => {
  describe("combineJSON", () => {
    it("should return an object", () => {
      var test = combineJSON(
        helpers.getTokens(["./__tests__/__json_files/*.json"])
      );
      expect(typeof test).toBe("object");
    });

    it("should handle wildcards", () => {
      var test = combineJSON(
        helpers.getTokens(["./__tests__/__json_files/*.json"])
      );
      expect(typeof test).toBe("object");
    });

    it("should do a deep merge", () => {
      var test = combineJSON(
        helpers.getTokens(["./__tests__/__json_files/shallow/*.json"]),
        true
      );
      expect(test).toHaveProperty("a", 2);
      expect(test.b).toMatchObject({ a: 1, c: 2 });
      expect(test).toHaveProperty("d.e.f.g", 1);
      expect(test).toHaveProperty("d.e.f.h", 2);
    });

    it("should do a shallow merge", () => {
      var test = combineJSON(
        helpers.getTokens(["./__tests__/__json_files/shallow/*.json"])
      );
      expect(test).toHaveProperty("a", 2);
      expect(test.b).toMatchObject({ c: 2 });
      expect(test).toHaveProperty("c", [3, 4]);
      expect(test).not.toHaveProperty("d.e.f.g");
      expect(test).toHaveProperty("d.e.f.h", 2);
    });

    it("should fail if there is a collision and it is passed a collision function", () => {
      expect(
        combineJSON.bind(
          null,
          helpers.getTokens(["./__tests__/__json_files/shallow/*.json"]),
          true,
          function Collision(opts) {
            expect(opts).toHaveProperty("key", "a");
            expect(opts.target[opts.key]).toBe(1);
            expect(opts.copy[opts.key]).toBe(2);
            throw new Error("test");
          },
          true
        )
      ).toThrow(/test/);
    });
  });
});
