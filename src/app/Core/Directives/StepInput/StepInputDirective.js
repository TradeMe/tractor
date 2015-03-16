'use strict';

// Utilities
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../Validators/ExampleNameValidator');

// Module:
var Core = require('../../Core');

var StepInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            example: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/StepInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-step-input" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.label)) {
            throw new Error('The "tractor-step-input" directive requires a "label" attribute.');
        }

        if (_.isUndefined($attrs.form)) {
            throw new Error('The "tractor-step-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.property = camelcase($scope.label);
    }
};

Core.directive('tractorStepInput', StepInputDirective);
