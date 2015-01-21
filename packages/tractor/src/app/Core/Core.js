'use strict';

// Utilities:
var angular = require('angular');
var WebSocket = require('ws');

var Core = angular.module('Core', []);

module.exports = Core;

require('./Directives/Action/ActionDirective');
require('./Directives/LiteralInput/LiteralInputDirective');
require('./Directives/SelectInput/SelectInputDirective');
require('./Directives/StepInput/StepInputDirective');
require('./Directives/TextInput/TextInputDirective');
require('./Directives/VariableInput/VariableInputDirective');
