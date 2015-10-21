'use strict';

// Utilities:
var angular = require('angular');

// Dependencies:
require('../../Core/Core');

var FeatureEditor = angular.module('FeatureEditor', ['Core']);

FeatureEditor.constant('FeatureIndent', '  ');
FeatureEditor.constant('FeatureNewLine', '\n');

module.exports = FeatureEditor;
