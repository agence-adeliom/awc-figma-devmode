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
%>
//
// <%= file.destination %>
//
<%= fileHeader({ file, commentStyle: 'short' }) %>
#import "<%= file.className %>.h"

<% dictionary.allTokens.forEach(function(prop) {  %>
NSString * const <%= prop.name %> = <%= prop.value %>;<% }); %>

@implementation <%= file.className %>

+ (NSArray *)values {
  static NSArray* array;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    array = @[
      <%= dictionary.allTokens.map(buildProperty).join(',\\n') %>
    ];
  });

  return array;
}

@end

<% function buildProperty(prop) {
  var to_ret = '@{\\n';
  to_ret += '  ' + '@"value": ' + prop.value + ',\\n';
  to_ret += '  ' + '@"name": @"' + prop.name + '",\\n';

  for(var name in prop.attributes) {
    if (prop.attributes[name]) {
      to_ret += '    ' + '@"' + name + '": @"' + prop.attributes[name] + '",\\n';
    }
  }

  // remove last comma
  return to_ret.slice(0, -2) + '\\n' + '  ' + '}';
} %>
`;
