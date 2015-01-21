'use strict';

// Utilities:
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var SelectInputDirective = function () {
    return {
        restrict: 'E',
        scope: {
            label: '@',
            model: '=',
            options: '=',
            as: '@'
        },
        template: fs.readFileSync(__dirname + '/SelectInput.html', 'utf8'),
        link: function ($scope) {
            $scope.$watch('options', function () {
                $scope.property = camelcase($scope.label);
                $scope.selectOptions = $scope.options || $scope.model[$scope.property + 's'];
            });
        }
    };
};

Core.directive('tractorSelect', SelectInputDirective);
