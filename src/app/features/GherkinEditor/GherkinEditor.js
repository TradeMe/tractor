'use strict';

// Utilities:
var angular = require('angular');

// Dependencies:
require('../../Core/Core');

var GherkinEditor = angular.module('GherkinEditor', ['Core']);

GherkinEditor.constant('GherkinIndent', '  ');
GherkinEditor.constant('GherkinNewLine', '%%NEWLINE%%');

module.exports = GherkinEditor;
