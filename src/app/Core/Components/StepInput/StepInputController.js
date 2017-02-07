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
        fileStructureService
    ) {
        this.fileStructureService = fileStructureService;
        this.items = [];
        this.isOpen = false;
    };

    StepInputController.prototype.handleSearch = function (searchKey) {
        if (searchKey) {
            this.searchKey = searchKey;
            return getSearchData(this)
               .then(getSuggestions.bind(this));
        } else {
            this.isOpen = false;
        }
     };

    StepInputController.prototype.itemSelected = function (index) {
        this.model.step = this.items[index];
        this.isOpen = false;
    };

    function getSearchData (that){
        return that.fileStructureService.getFileStructure('features')
        .then(function (results) {
            return results;
        }).then(getFilteredList.bind(that));
    };

    function getFilteredList (fileStructure) {
        var type = this.model.type;
        return Array.from(new Set(
            fileStructure.directory.allFiles
            .reduce(function (p, feature) { return p.concat(feature.tokens); } ,[])
            .reduce(function (p, token) { return p.concat(token.elements); }, [])
            .reduce(function (p, element) { return p.concat(element.stepDeclarations); } ,[])
            .map(function (declaration) { return declaration.step})
        ));
   };

   function getSuggestions (searchData) {
        this.items=[];
        if (searchData.length > 0) {
            var searchTextSmallLetters = angular.lowercase(this.searchKey);
            var searchTerms = searchTextSmallLetters.split(' ');
            for(var i=0; i< searchData.length; i++) {
                var searchItemsSmallLetters = angular.lowercase(searchData[i]);
                var isMissingTerm = false;
                for(var j=0; j < searchTerms.length; j++){
                    if ( searchItemsSmallLetters.indexOf(searchTerms[j]) === -1) {
                        isMissingTerm = true;
                        break;
                    }
                }
                if (!isMissingTerm) {
                    if (this.items.indexOf(searchData[i])==-1){
                        this.items.push(searchData[i]);
                    }
                }
            }

            this.isOpen = true;
        } else {
            this.model.step = this.searchKey;
        }
    };

    return StepInputController;
})();

Core.controller('StepInputController', StepInputController);
