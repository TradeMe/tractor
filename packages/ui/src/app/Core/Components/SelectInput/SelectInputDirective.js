'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var SelectInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            options: '=',
            required: '=',
            as: '@'
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/SelectInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-select" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.label)) {
            throw new Error('The "tractor-select" directive requires a "label" attribute.');
        }

        $scope.property = camelcase($scope.label);
        $scope.selectOptions = getOptionsFromProperty($scope);

        if (_.isUndefined($scope.selectOptions) && _.isUndefined($scope.options)) {
            throw new Error('The "tractor-select" directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
        }

        $scope.$watchCollection('options', function () {
            $scope.selectOptions = $scope.options || getOptionsFromProperty($scope);
        });

        $scope.form = $scope.$parent[$attrs.form] || $scope.$parent.$ctrl[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());
    }

    function getOptionsFromProperty ($scope) {
        return $scope.model[$scope.property + 's'];
    }
};

Core.directive('tractorSelect', SelectInputDirective);
