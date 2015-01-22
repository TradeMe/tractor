'use strict';

// Utilities
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

// Dependencies:
require('../../Services/ValidationService');

var StepInputDirective = function (ValidationService, StepDeclarationModel) {
    var validateExampleVariableNames = function ($scope, property, value) {
        var validations = StepDeclarationModel.getExampleVariableNames(value)
        .map(function (variable) {
            return ValidationService.validateVariableName(variable);
        });

        Promise.all(validations)
        .then(function () {
            $scope.model.setValidValue($scope.property, value);
        });
    };

    return {
        restrict: 'E',
        scope: {
            label: '@',
            model: '='
        },
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/../TextInput/TextInput.html', 'utf8'),
        /* eslint-enable no-path-concat */
        link: function ($scope) {
            $scope.$watch('model', function () {
                $scope.property = camelcase($scope.label);
                $scope.blur = _.curry(validateExampleVariableNames)($scope, $scope.property);
            });
        }
    };
};

Core.directive('tractorStepInput', StepInputDirective);
