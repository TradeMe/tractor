+'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');

// Module:
var Core = require('../../Core');

// Dependencies:
require('../../Services/FileStructureService');

var StepInputController = (function () {
    var StepInputController = function StepInputController (
        fileStructureService,
        StepModel
    ) {
        this.fileStructureService = fileStructureService;
        var stepNamesRegex = new RegExp('(' + StepModel.prototype.stepTypes.join('|') + ') ');
        this.stepNames = this.availableStepDefinitions.map(function (stepDefinition) {
            return stepDefinition.meta.name.replace(stepNamesRegex, '');
        });
        this.stepNamesLowerCase = this.stepNames.map(function (stepName) {
            return stepName.toLowerCase();
        });

        this.isOpen = false;
    };

    StepInputController.prototype.handleSearch = function (searchKey) {
        if (searchKey) {
            this.searchKey = searchKey;
            this.items = getSuggestions.call(this);
        }
        this.isOpen = !!searchKey;
        this.hasMore = this.items.length > 10;
     };

    StepInputController.prototype.itemSelected = function (index) {
        this.model.step = this.items[index];
        this.isOpen = false;
    };


   function getSuggestions () {
        var items = [];
        var searchKey = this.searchKey.toLowerCase();
        var steps = this.stepNamesLowerCase.length
        for (var i = 0; i < steps; i += 1) {
            if (this.stepNamesLowerCase[i].indexOf(searchKey) >= 0) {
                items.push(this.stepNames[i]);
            }
            if (items.length === 11) {
                break;
            }
        }
        return items;
    };

    return StepInputController;
})();

Core.controller('StepInputController', StepInputController);
