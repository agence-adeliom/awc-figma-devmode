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

var deepExtend = require("./deepExtend");

function traverseObj(obj, fn) {
  for (let key in obj) {
    fn.apply(null, [obj, key, obj[key]]);
    if (obj[key] && typeof obj[key] === 'object') {
      traverseObj(obj[key], fn);
    }
  }
}

/**
 * Takes an array of json files and merges
 * them together. Optionally does a deep extend.
 * @private
 * @param {Object[]} arr - Array of Tokens Object
 * @param {Boolean} [deep=false] - If it should perform a deep merge
 * @param {Function} collision - A function to be called when a name collision happens that isn't a normal deep merge of objects
 * @param {Boolean} [source=true] - If json files are "sources", tag properties
 * @returns {Object}
 */
function combineJSON(arr, deep, collision, source) {
  var i,
    to_ret = {};

  for (i = 0; i < arr.length; i++) {
    var file_content = arr[i];

    // Add some side data on each property to make filtering easier
    traverseObj(file_content, (obj) => {
      if (obj.hasOwnProperty("value")) {
        obj.isSource = source || source === undefined ? true : false;
      }
    });

    if (deep) {
      deepExtend([to_ret, file_content], collision);
    } else {
      Object.assign(to_ret, file_content);
    }
  }

  return to_ret;
}

module.exports = combineJSON;
