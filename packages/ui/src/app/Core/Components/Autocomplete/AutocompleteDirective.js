'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Dependencies:
var camelcase = require('change-case').camel;

// Module:
var Core = require('../../Core');

var AutocompleteDirective = function () {
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
        template: fs.readFileSync(__dirname + '/Autocomplete.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link
    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.model)) {
            throw new Error('The "tractor-autocomplete" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.label)) {
            throw new Error('The "tractor-autocomplete" directive requires a "label" attribute.');
        }

        $scope.property = camelcase($scope.label);
        $scope.selectOptions = getOptionsFromProperty($scope);

        if (_.isUndefined($scope.selectOptions) && _.isUndefined($scope.options)) {
            throw new Error('The "tractor-autocomplete" directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
        }

        $scope.value = $scope.model[$scope.property];
        if ($scope.as) {
            $scope.value = $scope.value[$scope.as];
        }

        $scope.form = $scope.$parent[$attrs.form] || $scope.$parent.$ctrl[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.updateModel = function () {
            $scope.autocompleteOptions = getAutocompleteOptions($scope.autocompleteValues, $scope.selectValues, $scope.value);
            var valueIndex = $scope.selectValues.indexOf($scope.value);
            var value = $scope.selectOptions[valueIndex];
            if (value && $scope.model[$scope.property] !== value) {
                $scope.model[$scope.property] = value;
            }
        };

        $scope.$watchCollection('options', function () {
            $scope.selectOptions = $scope.options || getOptionsFromProperty($scope);
            $scope.selectValues = getValues($scope.selectOptions, $scope.as);
            $scope.autocompleteValues = $scope.selectValues.map(function (value) { return value.toLowerCase(); });
            $scope.updateModel();
        });
    }

    function getOptionsFromProperty ($scope) {
        return $scope.model[$scope.property + 's'];
    }

    function getValues (options, as) {
        return options.map(function (option) { return as ? option[as] : option; });
    }

    function getAutocompleteOptions (autocompleteValues, selectValues, search) {
        var results = [];
        search = (search || '').toLowerCase();
        for (var i = 0; i < autocompleteValues.length; i += 1) {
            if (results.length === 20) {
                break;
            }
            var value = autocompleteValues[i];
            if (value.indexOf(search) !== -1) {
                results.push(selectValues[i]);
            }
        }
        return results;
    }
};

Core.directive('tractorAutocomplete', AutocompleteDirective);
