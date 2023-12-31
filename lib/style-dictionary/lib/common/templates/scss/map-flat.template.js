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
<%= fileHeader({file, commentStyle: 'long'}) %><%
    var output = '';
    output += \`$\${file.mapName||'tokens'}: (\\n\`;
    output += allTokens.map(function(prop){
        var line = '';
        if(prop.comment) {
        line += '  // ' + prop.comment + '\\n';
        }
        line += '  \\'' + prop.name + '\\': ' + (prop.attributes.category==='asset' ? '"'+prop.value+'"' : prop.value)
        return line;
    }).join(',\\n');
    output += '\\n);';
    print(output);
%>
`;
