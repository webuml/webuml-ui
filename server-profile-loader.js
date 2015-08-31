"use strict";

var fs = require('fs');
var querystring = require('querystring');
var propertiesParser = require('properties-parser');

module.exports = new function () {

  function escapeSpecialCharacters(chars) {
    return querystring.escape(chars).replace(/%/g, '');
  }

  function mergeProps(dest, source) {
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = source[key];
      }
    }
    return dest;
  }

  return {
    loadProfile: function (profileName) {
      var appProps = propertiesParser.read('./application.properties');
      var props = mergeProps({}, appProps);
      var profileFileName = './application-' + escapeSpecialCharacters(profileName) + '.properties';
      if (profileName && fs.existsSync(profileFileName)) {
        var profileProps = propertiesParser.read(profileFileName);
        props = mergeProps(props, profileProps);
      }
      return props;
    }
  };
};