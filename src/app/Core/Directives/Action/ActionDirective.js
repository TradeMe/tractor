'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var ActionDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            action: '@',
            argument: '=',
            icon: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/Action.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-action" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.action)) {
            throw new Error('The "tractor-action" directive requires an "action" attribute.');
        }

        $scope.method = camelcase($scope.action);
    }
};

Core.directive('tractorAction', ActionDirective);
