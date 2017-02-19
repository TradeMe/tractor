'use strict';

// Utilities:
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');

var FileEditorController = (function () {
    var FileEditorController = function FileEditorController (
        $scope,
        $window,
        $state,
        confirmDialogService,
        fileStructureService,
        persistentStateService,
        notifierService,
        FileModel,
        file,
        type,
        extension
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.confirmDialogService = confirmDialogService;
        this.fileStructureService = fileStructureService,
        this.persistentStateService = persistentStateService;
        this.notifierService = notifierService;
        this.FileModel = FileModel;
        this.type = type;
        this.extension = extension;

        if (file) {
            this.fileModel = file;
        } else if (FileModel && !this.fileModel) {
            this.newFile();
        }
    };

    FileEditorController.prototype.newFile = function () {
        if (this.fileModel) {
            this.$state.go('.', { file: null });
        }
        this.fileModel = new this.FileModel();
    };

    FileEditorController.prototype.saveFile = function () {
        var fileStructure = this.fileStructureService.fileStructure;
        var fileUrl = this.fileModel.url || path.join(fileStructure.url, this.type, this.fileModel.name + this.extension);

        var exists = this.fileStructureService.checkFileExists(fileStructure, fileUrl);

        var confirm = Promise.resolve();
        if (exists) {
            this.confirmOverWrite = this.confirmDialogService.show();
            confirm = this.confirmOverWrite.promise
            .finally(function () {
                this.confirmOverWrite = null;
            }.bind(this));
        }

        confirm.then(function () {
            return this.fileStructureService.saveItem(fileUrl, {
                data: this.fileModel.data,
                overwrite: exists
            });
        }.bind(this))
        .then(function () {
            this.$state.go('.', {
                file: {
                    url: fileUrl
                }
            });
        }.bind(this))
        .catch(function () {
            this.notifierService.error('File was not saved.');
        }.bind(this));
    };

    FileEditorController.prototype.showErrors = function () {
        var fileEditor = this.fileEditor;
        if (fileEditor.$invalid) {
            _.each(Object.keys(fileEditor.$error), function (invalidType) {
                _.each(fileEditor.$error[invalidType], function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save file, something is invalid.');
        }
        return !fileEditor.$invalid;
    };

    FileEditorController.prototype.minimise = function (item) {
        item.minimised = !item.minimised;

        var displayState = this.persistentStateService.get(this.fileModel.name);
        displayState[item.name] = item.minimised;
        this.persistentStateService.set(this.fileModel.name, displayState);
    };

    FileEditorController.prototype.getLink = function (state, file) {
        return decodeURIComponent(this.$state.href(state, { file: file }));
    }

    return FileEditorController;
})();

module.exports = FileEditorController;

// 'use strict';
//
// // Utilities:
// var _ = require('lodash');
// var Promise = require('bluebird');
// var stripcolorcodes = require('stripcolorcodes');
//
// var FileEditorController = (function () {
//     var FileEditorController = function FileEditorController (
//         $scope,
//         $window,
//         $state,
//         confirmDialogService,
//         persistentStateService,
//         notifierService,
//         FileService,
//         FileModel,
//         fileStructure,
//         filePath
//     ) {
//         this.$scope = $scope;
//         this.$window = $window;
//         this.$state = $state;
//         this.confirmDialogService = confirmDialogService;
//         this.persistentStateService = persistentStateService;
//         this.notifierService = notifierService;
//         this.fileService = FileService;
//         this.FileModel = FileModel;
//         this.fileStructure = fileStructure;
//
//         this.availableComponents = fileStructure.availableComponents;
//         this.availableMockData = fileStructure.availableMockData;
//         this.availableStepDefinitions = fileStructure.availableStepDefinitions;
//
//         if (filePath) {
//             this.fileService.openFile({ path: filePath.path }, this.availableComponents, this.availableMockData, this.availableStepDefinitions)
//             .then(function (file) {
//                 this.fileModel = file;
//                 this.fileModel.references = getReferencesFiles(filePath.path, this.fileStructure.references);
//             }.bind(this));
//         } else if (FileModel && !this.fileModel) {
//             this.newFile();
//         }
//
//         this.stepDefinitionsArray = [];
//         this.stepNameArray = [];
//     };
//
//     FileEditorController.prototype.newFile = function () {
//         if (this.fileModel) {
//             this.$state.go('.', { file: null });
//         }
//         this.fileModel = new this.FileModel();
//     };
//
//     FileEditorController.prototype.saveFile = function () {
//         var path = null;
//
//         this.fileService.getPath({
//             path: this.fileModel.path,
//             name: this.fileModel.name
//         })
//         .then(function (filePath) {
//             path = filePath.path;
//             var exists = this.fileService.checkFileExists(this.fileStructure, path);
//
//             if (exists) {
//                 this.confirmOverWrite = this.confirmDialogService.show();
//                 return this.confirmOverWrite.promise
//                 .finally(function () {
//                     this.confirmOverWrite = null;
//                 }.bind(this));
//             } else {
//                 return Promise.resolve();
//             }
//         }.bind(this))
//         .then(function () {
//             //this is not good. need to find another way
//             if (this.fileModel.hasOwnProperty('asA')) {
//                return getStepNameForFeature(this)
//                .then(getExistingStepDefinitions.bind(this))
//                .then(checkIfStepExists.bind(this))
//             } else {
//                 Promise.resolve();
//             }
//         }.bind(this))
//         .then(function () {
//             return this.fileService.saveFile({
//                 data: this.fileModel.data,
//                 path: path
//             });
//         }.bind(this))
//         .then(function () {
//             return this.fileService.getFileStructure();
//         }.bind(this))
//         .then(function (fileStructure) {
//             this.fileStructure = fileStructure;
//             this.fileService.openFile({ path: path }, this.availableComponents, this.availableMockData, this.availableStepDefinitions)
//             .then(function (file) {
//                 this.fileModel = file;
//                 this.fileModel.references = getReferencesFiles(path, this.fileStructure.references);
//             }.bind(this));
//         }.bind(this))
//         .catch(function () {
//             this.notifierService.error('File was not saved.');
//         }.bind(this));
//     };
//
//     FileEditorController.prototype.showErrors = function () {
//         var fileEditor = this.fileEditor;
//         if (fileEditor.$invalid) {
//             _.each(Object.keys(fileEditor.$error), function (invalidType) {
//                 _.each(fileEditor.$error[invalidType], function (element) {
//                     element.$setTouched();
//                 });
//             });
//             this.notifierService.error('Can\'t save file, something is invalid.');
//         }
//         return !fileEditor.$invalid;
//     };
//
//     FileEditorController.prototype.minimise = function (item) {
//         item.minimised = !item.minimised;
//
//         var displayState = this.persistentStateService.get(this.fileModel.name);
//         displayState[item.name] = item.minimised;
//         this.persistentStateService.set(this.fileModel.name, displayState);
//     };
//
//     //included relative stepDefinitions in references to components and mockData file model
//     function getReferencesFiles(filePath,references){
//         var referencesInstances = [];
//         if (references[filePath]) {
//             _.each(references[filePath], function(referencePath){
//                 var referenceModel = {
//                     name : _.first( referencePath.substring(referencePath.lastIndexOf('\\') + 1,referencePath.lastIndexOf('.')).split(".") ),
//                     path : referencePath
//                 };
//                 referencesInstances.push(referenceModel);
//             });
//         }
//         return referencesInstances;
//     }
//
//     function getStepNameForFeature(self) {
//         self.stepNameArray = [];
//         return new Promise(function (resolve, reject) {
//             var stepNames = extractSteps(self.fileModel.data);
//             _.each (stepNames, function (stepName) {
//                 var stepNameStruct = {
//                     name : stepName.substr(stepName.indexOf(" ") + 1),
//                     type : _.first( stepName.split(" ") )
//                 }
//                 resolve(self.stepNameArray.push(stepNameStruct));
//              });
//         });
//     }
//
//     function extractSteps(featureFileContent) {
//         var GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
//         var AND_BUT_REGEX = /^(And|But)/;
//         var NEW_LINE_REGEX = /\r\n|\n/;
//
//         return stripcolorcodes(featureFileContent)
//         // Split on new-lines:
//         .split(NEW_LINE_REGEX)
//         // Remove whitespace:
//         .map(line => line.trim())
//         // Get out each step name:
//         .filter((line) => GIVEN_WHEN_THEN_REGEX.test(line) || AND_BUT_REGEX.test(line))
//         .map((stepName, index, stepNames) => {
//             if (AND_BUT_REGEX.test(stepName)) {
//                 let previousType = _(stepNames)
//                 .take(index + 1)
//                 .reduceRight((p, n) => {
//                     let type = n.match(GIVEN_WHEN_THEN_REGEX);
//                     return p || _.last(type);
//                 }, null);
//                 return stepName.replace(AND_BUT_REGEX, previousType);
//             } else {
//                 return stepName;
//             }
//         });
//     }
//
//     function getExistingStepDefinitions() {
//        var self = this;
//        self.stepDefinitionsArray = [];
//        return new Promise(function (resolve, reject) {
//            _.each(self.availableStepDefinitions, function(stepDefs) {
//                var StepDefinitionStruct = {
//                    name : stepDefs.name.substr(stepDefs.name.indexOf(" ") + 1),
//                    type : _.first( stepDefs.name.split(" ") )
//                };
//                resolve (self.stepDefinitionsArray.push(StepDefinitionStruct));
//              });
//        });
//     }
//
//     function checkIfStepExists() {
//         var self = this;
//         var promiseStatus = false;
//         return new Promise(function (resolve, reject) {
//             _.each(self.stepNameArray, function(steps) {
//                 _.find(self.stepDefinitionsArray, function (stepDefs) {
//                     if (stepDefs.name === steps.name && stepDefs.type !== steps.type) {
//                         promiseStatus = true;
//                         self.notifierService.error("'"+stepDefs.type + ' ' + stepDefs.name+"'" + ' already exists.Can\'t save it as '+ steps.type);
//                      }
//                 });
//             });
//             if (promiseStatus) {
//                 return reject(Error("Not Saving File"));
//             } else {
//                 return resolve();
//             }
//         });
//      }
//
//     return FileEditorController;
// })();
//
// module.exports = FileEditorController;
