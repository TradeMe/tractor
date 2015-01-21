'use strict';

// Utilities:
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var ActionDirective = function () {
    return {
        restrict: 'E',
        scope: {
            action: '@',
            model: '=',
            argument: '=',
            icon: '@'
        },
        template: fs.readFileSync(__dirname + '/Action.html', 'utf8'),
        link: function ($scope) {
            $scope.method = camelcase($scope.action);
        }
    };
};

Core.directive('tractorAction', ActionDirective);
