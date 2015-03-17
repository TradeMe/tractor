'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

// Dependencies:
var camelcase = require('change-case').camel;
var pascalcase = require('change-case').pascal;
require('../Services/ValidationService');

var VariableNameValidator = function (
    $rootScope,
    ValidationService
) {
    var ModelChangeEvent = 'VariableNameValidator:ModelChange';

    return {
        restrict: 'A',

        require: 'ngModel',

        scope: {
            variableValue: '=ngModel',
            variableNameModel: '='
        },

        link: link
    };

    function link ($scope, element, attrs, ngModelController) {
        var destroy = $rootScope.$on(ModelChangeEvent, function (event, changing) {
            if (ngModelController !== changing) {
                ngModelController.$validate();
            }
        });

        $scope.$watch('variableValue', function () {
            $rootScope.$broadcast(ModelChangeEvent, ngModelController);
        });

        $scope.$on('$destroy', function () {
            destroy();
        });

        ngModelController.$validators.uniqueVariableName = function (value) {
            var allVariableNames = $scope.variableNameModel.getAllVariableNames();
            var result = !_.contains(allVariableNames, value);
            return result;
        };

        ngModelController.$asyncValidators.validVariableName = function (value) {
            var variableName = $scope.$parent.isClass ? pascalcase(value) : camelcase(value);
            return ValidationService.validateVariableName(variableName);
        };
    }
};

Core.directive('variableName', VariableNameValidator);
