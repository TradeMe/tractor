'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var TextInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/TextInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-text-input" directive requires a "model" attribute.');
        }

        $scope.model.setValidValue = $scope.model.setValidValue || _.noop;

        if (_.isUndefined($scope.label)) {
            throw new Error('The "tractor-text-input" directive requires a "label" attribute.');
        }

        $scope.property = camelcase($scope.label);
        $scope.blur = _.partial(validateValue, $scope);
    }

    function validateValue ($scope, value) {
        $scope.model.setValidValue($scope.property, value);
    }
};

Core.directive('tractorTextInput', TextInputDirective);
