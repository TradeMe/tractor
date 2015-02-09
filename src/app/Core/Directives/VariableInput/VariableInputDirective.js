'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

// Dependencies:
require('../../Services/ValidationService');

var VariableInputDirective = function (ValidationService) {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            class: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/../TextInput/TextInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope) {
        $scope.$watch('model', function () {
            $scope.property = camelcase($scope.label);
            $scope.blur = _.partial(validateVariableName, $scope);
        });
    }

    function validateVariableName ($scope, value) {
        if (value) {
            ValidationService.validateVariableName(value, $scope.class)
            .then(function () {
                $scope.model.validateName($scope.model, value);
            });
        } else {
            $scope.model.validateName($scope.model, value);
        }
    }
};

Core.directive('tractorVariableInput', VariableInputDirective);
