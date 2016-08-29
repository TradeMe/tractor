'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');

// Module:
var Core = require('../Core');

// Dependencies:
var camelcase = require('change-case').camel;
var pascalcase = require('change-case').pascal;
require('../Components/Notifier/NotifierService');
require('../Services/ValidationService');

var VariableNameValidator = function (
    $rootScope,
    notifierService,
    validationService
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

        ngModelController.$validators.variableNameUnique = function (value) {
            var allVariableNames = $scope.variableNameModel.getAllVariableNames();
            var result = !_.contains(allVariableNames, value);
            return result;
        };

        ngModelController.$validators.variableNameValid = function (value) {
            var variableName = $scope.$parent.isClass ? pascalcase(value) : camelcase(value);
            if (variableName.length === 0) {
                return false;
            }
            return validationService.validateVariableName(variableName);
        };
    }
};

Core.directive('variableName', VariableNameValidator);
