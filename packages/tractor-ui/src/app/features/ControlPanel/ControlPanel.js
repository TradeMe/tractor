'use strict';

// Utilities:
var angular = window.angular;

// Dependencies:
require('../Search/Search');
require('../../Core/Core');

var ControlPanel = angular.module('ControlPanel', ['Core', 'Search']);

module.exports = ControlPanel;
