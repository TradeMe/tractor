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
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/Action.html', 'utf8'),
        /* eslint-enable no-path-concat */
        link: function ($scope) {
            $scope.method = camelcase($scope.action);
        }
    };
};

Core.directive('tractorAction', ActionDirective);
