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

  var colorRegex = /^(#(?:[\\da-f]{3}){1,2}|rgb\\((?:\\d{1,3},\\s*){2}\\d{1,3}\\)|rgba\\((?:\\d{1,3},\\s*){3}\\d*\\.?\\d+\\)|hsl\\(\\d{1,3}(?:,\\s*\\d{1,3}%){2}\\)|hsla\\(\\d{1,3}(?:,\\s*\\d{1,3}%){2},\\s*\\d*\\.?\\d+\\)|IndianRed|LightCoral|Salmon|DarkSalmon|LightSalmon|Crimson|Red|FireBrick|DarkRed|Pink|LightPink|HotPink|DeepPink|MediumVioletRed|PaleVioletRed|LightSalmon|Coral|Tomato|OrangeRed|DarkOrange|Orange|Gold|Yellow|LightYellow|LemonChiffon|LightGoldenrodYellow|PapayaWhip|Moccasin|PeachPuff|PaleGoldenrod|Khaki|DarkKhaki|Lavender|Thistle|Plum|Violet|Orchid|Fuchsia|Magenta|MediumOrchid|MediumPurple|RebeccaPurple|BlueViolet|DarkViolet|DarkOrchid|DarkMagenta|Purple|Indigo|SlateBlue|DarkSlateBlue|MediumSlateBlue|GreenYellow|Chartreuse|LawnGreen|Lime|LimeGreen|PaleGreen|LightGreen|MediumSpringGreen|SpringGreen|MediumSeaGreen|SeaGreen|ForestGreen|Green|DarkGreen|YellowGreen|OliveDrab|Olive|DarkOliveGreen|MediumAquamarine|DarkSeaGreen|LightSeaGreen|DarkCyan|Teal|Aqua|Cyan|LightCyan|PaleTurquoise|Aquamarine|Turquoise|MediumTurquoise|DarkTurquoise|CadetBlue|SteelBlue|LightSteelBlue|PowderBlue|LightBlue|SkyBlue|LightSkyBlue|DeepSkyBlue|DodgerBlue|CornflowerBlue|MediumSlateBlue|RoyalBlue|Blue|MediumBlue|DarkBlue|Navy|MidnightBlue|Cornsilk|BlanchedAlmond|Bisque|NavajoWhite|Wheat|BurlyWood|Tan|RosyBrown|SandyBrown|Goldenrod|DarkGoldenrod|Peru|Chocolate|SaddleBrown|Sienna|Brown|Maroon|White|Snow|HoneyDew|MintCream|Azure|AliceBlue|GhostWhite|WhiteSmoke|SeaShell|Beige|OldLace|FloralWhite|Ivory|AntiqueWhite|Linen|LavenderBlush|MistyRose|Gainsboro|LightGray|Silver|DarkGray|Gray|DimGray|LightSlateGray|SlateGray|DarkSlateGray|Black)$/i;

  var checkForStyle = function(property) {
    var toStyle = "";
    if(property.value.match(colorRegex)) {
      if(property.path.indexOf('font')>-1) {
        toStyle += "color:" + property.value + ";";
      }
      else {
        toStyle += "background-color:" + property.value + ";";
      }
      if (property.attributes.font === 'inverse') {
        toStyle += "color:var(--color-font-inverse-base);";
      }
    }
    return toStyle;
  };

  var checkPropGetInverse = function (property) {
    if(property.path.indexOf('inverse')>-1) {
      return 'inverse';
    }
  };
%>
<html>
<head>
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div class="nav-bar">
    <div class="title">Style Guide</div>
    <div class="nav-search">
      <span>Search for</span>
      <input class="search-box" type="text" />
      <span>in </span>
      <label lass="search-modifier" for="use_path"><input class="search-modifier use_path" name="use_path" type="checkbox" checked />name</label>
      <label lass="search-modifier" for="use_value"><input class="search-modifier use_value" name="use_value" type="checkbox" checked />value</label>
      <label lass="search-modifier" for="use_attributes"><input class="search-modifier use_attributes" name="use_attributes" type="checkbox" checked />attributes</label>
    </div>
  </div>

  <div class="style-guide">
    <% _.each(allTokens, function(property) { %>
      <div class="style-guide-property <%= checkPropGetInverse(property) %>" data-path="<%= property.path.join("-") %>" style="<%= checkForStyle(property) %>">
        <div class="style-guide-property-path"><%= property.path.join(".") %></div>
        <div class="style-guide-property-name"><%= property.name %></div>
        <% if(property.attributes && JSON.stringify(property.attributes)!=="{}") { %>
          <div class="style-guide-property-attributes-control"></div>
        <% } %>
        <div class="style-guide-property-value"><%= property.value %><% if(property.attributes.category === 'content' && property.attributes.type === 'icon') { %><i class="icon-font"><%= property.value %></i><% } %></div>
        <% if(property.attributes && JSON.stringify(property.attributes)!=="{}") { %>
          <div class="style-guide-property-attributes"><%= JSON.stringify(property.attributes) %></div>
        <% } %>
      </div>
    <% }); %>
  </div>

  <script src="http://code.jquery.com/jquery-3.1.1.min.js"
  integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
  <script src="js/style-dictionary-properties.js"></script>
  <script src="js/main.js"></script>
</body>
`;
