'use strict';

// Utilities:
var _ = require('lodash');
var fs = require('fs');

// Module:
var Core = require('../../Core');

// Dependencies:
var camelcase = require('change-case').camel;
require('../../Validators/ExampleNameValidator');
require('./StepInputController');

var StepInputDirective = function () {
    return {
        restrict: 'E',

        scope: {
            model: '=',
            label: '@',
            example: '@',
            data: '=',
            required: '@',
            title: '@'        
        },

        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/StepInput.html', 'utf8'),
        /* eslint-enable no-path-concat */

        link: link,

        controller: "StepInputController",
        controllerAs: 'stepInput',
        bindToController: true,

    };

    function link ($scope, $element, $attrs) {
        if (_.isUndefined($scope.stepInput.model)) {
            throw new Error('The "tractor-step-input" directive requires a "model" attribute.');
        }

        if (_.isUndefined($scope.stepInput.label)) {
            throw new Error('The "tractor-step-input" directive requires a "label" attribute.');
        }

        if (_.isUndefined($attrs.form)) {
            throw new Error('The "tractor-step-input" directive requires a "form" attribute.');
        }

        if (_.isUndefined($scope.stepInput.data)) {
            throw new Error('The "tractor-step-input" directive requires a "data" attribute.');
        }

        if (_.isUndefined($scope.stepInput.required)) {
            throw new Error('The "tractor-step-input" directive requires a "required" attribute.');
        }        
        
        $scope.stepInput.form = $scope.$parent[$attrs.form];       
        $scope.stepInput.id = Math.floor(Math.random() * Date.now());
        $scope.stepInput.property = camelcase($scope.stepInput.label);
        $scope.selectedIndex = -1;       
       
        $scope.handleKeyDown = function (event) {
            if (event.keyCode === 40) {
                event.preventDefault();               
                if ($scope.selectedIndex + 1 !== $scope.stepInput.items.length) {                
                    $scope.selectedIndex++;                   
                }
            } else if (event.keyCode === 38) {
                event.preventDefault();
                if ($scope.selectedIndex - 1 !== -1) {
                    $scope.selectedIndex--;
                }
            } else if (event.keyCode === 27) {
                $scope.stepInput.isOpen = false;
            } else if (event.keyCode === 8) {
                $scope.selectedIndex = -1;
            } else if (event.keyCode === 13) {
                 event.preventDefault();                 
                 $scope.stepInput.model[$scope.stepInput.property] = $scope.stepInput.items[$scope.selectedIndex];
                 $scope.stepInput.isOpen = false;
            }
        }

        $scope.hoverOver = function (index, suggestion) {
            switch (camelcase($scope.stepInput.label)) {
                case 'componentName':
                     _.find($scope.stepInput.data.fileStructure.availableComponents,function (components) {                        
                         if (components.name === suggestion) {
                             $scope.stepInput.title = components.meta;
                         }
                     });
                     break;
                case 'mockDataName':
                     _.find($scope.stepInput.data.fileStructure.availableMockData,function (mockData) {                        
                         if (mockData.name === suggestion) {
                             $scope.stepInput.title = mockData.json;
                         }
                     });
                    break;
            }
        }
    }
};

Core.directive('tractorStepInput', StepInputDirective);
