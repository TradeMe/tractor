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
            label: '@',
            model: '='
        },
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/TextInput.html', 'utf8'),
        /* eslint-enable no-path-concat */
        link: function ($scope) {
            $scope.$watch('model', function () {
                $scope.property = camelcase($scope.label);
                $scope.blur = _.bind($scope.model.setValidValue, $scope.model, $scope.property);
            });
        }
    };
};

Core.directive('tractorTextInput', TextInputDirective);
