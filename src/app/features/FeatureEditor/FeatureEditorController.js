'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('./FeatureEditor');

// Dependencies:
require('./Services/FeatureFileService');
require('./Models/FeatureModel');

var FeatureEditorController = (function () {
    var FeatureEditorController = function FeatureEditorController (
        $scope,
        $window,
        NotifierService,
        FileStructureService,
        FeatureFileService,
        FeatureModel,
        featureFileStructure,
        feature
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.fileStructureService = FileStructureService;
        this.featureFileService = FeatureFileService;

        this.fileStructure = featureFileStructure;

        this.feature = feature || new FeatureModel();
    };

    FeatureEditorController.prototype.saveFeatureFile = function () {
        var featureString = this.feature.featureString;
        var name = this.feature.name;

        var exists = fileAlreadyExists(name, this.fileStructure);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.featureFileService.saveFeatureFile(featureString, name)
            .then(function () {
                this.feature.isSaved = true;
                return this.fileStructureService.getFileStructure('features');
            }.bind(this))
            .then(function (featureFileStructure) {
                this.fileStructure = featureFileStructure;
            }.bind(this));
        }
    };

    FeatureEditorController.prototype.showErrors = function () {
        var featureEditor = this.$scope['feature-editor'];
        if (featureEditor.$invalid) {
            Object.keys(featureEditor.$error).forEach(function (invalidType) {
                var errors = featureEditor.$error[invalidType];
                errors.forEach(function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save feature, something is invalid.');
            return false;
        } else {
            return true;
        }
    };

    function fileAlreadyExists (fileName, directory) {
        return _.some(directory, function (info, name) {
            if (info['-type'] === 'd') {
                // Directory:
                return fileAlreadyExists(fileName, info);
            } else if (name !== '-type' && name !== '-path') {
                // File:
                return new RegExp(fileName + '\.').test(name);
            }
        });
    }

    return FeatureEditorController;
})();

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
