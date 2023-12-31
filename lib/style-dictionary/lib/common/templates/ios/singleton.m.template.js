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
<%= fileHeader({ file, commentStyle: 'short' })%>
#import "<%= file.className %>.h"

@implementation <%= file.className %>

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = <%= buildDictionary(dictionary.properties) %>;
  });

  return dictionary;
}

@end

<% function buildDictionary(props, indent) {
  indent = indent || '  ';
  var to_ret = '@{\\n';
  if (props.hasOwnProperty('value')) {
    var value = props.attributes.category === 'size' || props.attributes.category === 'time' ? '@' + props.value : props.value;
    to_ret += indent + '@"value": ' + value + ',\\n';
    to_ret += indent + '@"name": @"' + props.name + '",\\n';

    for(var name in props.attributes) {
      if (props.attributes[name]) {
        to_ret += indent + '@"' + name + '": @"' + props.attributes[name] + '",\\n';
      }
    }

    // remove last comma
    return to_ret.slice(0, -2) + '\\n' + indent + '}';
  } else {
    for(var name in props) {
      to_ret += indent + '@"' + name + '": ' + buildDictionary(props[name], indent + '  ') + ',\\n';
    }
    // remove last comma
    return to_ret.slice(0, -2) + '\\n' + indent + '}';
  }
} %>
`;
