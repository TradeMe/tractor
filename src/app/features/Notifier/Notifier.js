'use strict';

// Utilities:
var angular = require('angular');

var Notifier = angular.module('Notifier', []);

module.exports = Notifier;

require('./Directives/NotifierDirective');
