module.exports = `<%
//
// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.

var props = dictionary.allTokens.filter(function(prop) {
  return prop.attributes.category !== 'asset' &&
         prop.attributes.category !== 'border' &&
         prop.attributes.category !== 'shadow' &&
         prop.attributes.category !== 'transition';
}); %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<%= fileHeader({ file, commentStyle: 'xml' }) %>
<plist version="1.0">
  <dict>
    <% props.forEach(function(prop) {
    %><key><%= prop.name %></key>
    <% if (prop.attributes.category === 'color') { %><dict>
      <key>r</key>
      <real><%= prop.value[0]/255 %></real>
      <key>g</key>
      <real><%= prop.value[1]/255 %></real>
      <key>b</key>
      <real><%= prop.value[2]/255 %></real>
      <key>a</key>
      <real>1</real>
      </dict>
    <% } else if (prop.attributes.category === 'size') { %></dict>
      <integer><%= prop.value %></integer>
    <% } else { %></dict>
      <string><%= prop.value %></string>
    <% } %><% if (prop.comment) { %><!-- <%= prop.comment %> --><% } %><% }); %>
  </dict>
</plist>
`;
