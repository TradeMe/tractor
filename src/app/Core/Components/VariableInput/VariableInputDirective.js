'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../Validators/VariableNameValidator');

var VariableInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            example: '@',
            allVariableNames: '&'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/VariableInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-variable-input" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.label)) {
            throw new Error('The "tractor-variable-input" directive requires a "label" attribute.');
        }

        if (_.isUndefined($attrs.form)) {
            throw new Error('The "tractor-variable-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form] || $scope.$parent.$ctrl[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.isClass = Object.prototype.hasOwnProperty.call($attrs, 'isClass');
        $scope.property = camelcase($scope.label);
    }
};

Core.directive('tractorVariableInput', VariableInputDirective);
