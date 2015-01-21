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
    var validateVariableName = function ($scope, value) {
        if (value) {
            ValidationService.validateVariableName(value, $scope.class)
            .then(function (result) {
                $scope.model.validateName($scope.model, value);
            });
        } else {
            $scope.model.validateName($scope.model, value);
        }
    };

    return {
        restrict: 'E',
        scope: {
            label: '@',
            model: '=',
            class: '@'
        },
        template: fs.readFileSync(__dirname + '/../TextInput/TextInput.html', 'utf8'),

        link: function ($scope, $el, attributes) {
            $scope.$watch('model', function () {
                $scope.property = camelcase($scope.label);
                $scope.blur = _.curry(validateVariableName)($scope);
            });
        }
    };
};

Core.directive('tractorVariableInput', VariableInputDirective);
