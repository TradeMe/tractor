'use strict';

// Utilities:
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
var camelcase = require('change-case').camel;

var VariableInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            example: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/VariableInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        $scope.form = $scope.$parent[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.isClass = !!$attrs.isClass;

        $scope.$watch('model', function () {
            $scope.property = camelcase($scope.label);
        });
    }
};

Core.directive('tractorVariableInput', VariableInputDirective);
