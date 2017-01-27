'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');
var camelcase = require('change-case').camel;

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

    StepInputController.prototype.getSearchDataOnLoad = function (prop) {        
        this.lableItem = camelcase(prop);
        this.searchData = getFilteredList(this);        
    };

    StepInputController.prototype.handleSearch = function (searchKey) {
        if (searchKey) {            
           this.searchKey = searchKey;        
            return getSuggestions(this);
        } else {
            this.isOpen = false;
        }
     };
    
    StepInputController.prototype.itemSelected = function (index) { 
        var property = this.property;    
        this.model[property] = this.items[index];       
        this.isOpen = false;
    };
   
    function getFilteredList (that) {              
        var fileStructure = that.data.fileStructure;        
        switch(that.lableItem) {
            case 'step' :
                return  Array.from ( new Set (
                 fileStructure.directory.allFiles
                .reduce(function (p,feature ){return p.concat(feature.tokens) },[])
                .reduce(function (p,token ){return p.concat(token.elements) },[])
                .reduce(function (p, element){return p.concat(element.stepDeclarations) },[])
                //.filter(function (declaration){ return declaration.type === type } )
                .map(function (declaration) {return declaration.step})           
                ));
                break;
            case 'componentName':                
                var availableComponents = Array.from ( new Set (
                    fileStructure.availableComponents
                    .map(function (component) {return component.name})    
                ));
                var activeComponents = [];
                _.forEach(that.model.componentInstances, function(component){
                            activeComponents.push(component.component.name);
                });
                return _.difference(availableComponents, activeComponents);
                break;
            case 'mockDataName':
                var availableMockData = Array.from ( new Set (
                    fileStructure.availableMockData
                    .map(function (mockData) {return mockData.name})           
                ));
                var activeMockData = [];
                _.forEach(that.model.mockDataInstances, function(mockData){
                            activeMockData.push(mockData.mockData.name);
                });
                return _.difference(availableMockData, activeMockData);
                break;
        }    
    }

   function getSuggestions (self) {       
        self.items=[];
        if (self.searchData.length > 0) {
            var searchTextSmallLetters = angular.lowercase(self.searchKey);
            var searchTerms = searchTextSmallLetters.split(' ');
            for(var i=0; i< self.searchData.length; i++) {                
                var searchItemsSmallLetters = angular.lowercase(self.searchData[i]);
                var isMissingTerm = false;
                for(var j=0; j < searchTerms.length; j++){
                    if ( searchItemsSmallLetters.indexOf(searchTerms[j]) === -1) {
                        isMissingTerm = true;
                        break;
                    }
                }
                if (!isMissingTerm) {
                    if (self.items.indexOf(self.searchData[i])==-1){
                        self.items.push(self.searchData[i]);
                    }
                }
            }            

            self.isOpen = true;
        } else {
            self.model[property] = self.searchKey;
        }
    };     

    return StepInputController;
})();

Core.controller('StepInputController', StepInputController);
