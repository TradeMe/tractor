'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var FeatureEditor = require('./FeatureEditor');

// Dependencies:
require('./Services/FeatureFileService');
require('./Services/FeatureParserService');
require('./Models/FeatureModel');

var FeatureEditorController = (function () {
    var FeatureEditorController = function FeatureEditorController (
        $scope,
        $window,
        NotifierService,
        FeatureFileService,
        FeatureParserService,
        FeatureModel,
        featureFileStructure,
        featureFile
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.featureFileService = FeatureFileService;
        this.featureParserService = FeatureParserService;

        this.fileStructure = featureFileStructure;

        if (featureFile) {
            parseFeatureFile.call(this, featureFile);
        } else {
            this.feature = new FeatureModel();
        }
    };

    FeatureEditorController.prototype.saveFeatureFile = function () {
        var featureString = this.feature.featureString;
        var name = this.feature.name;

        var exists = fileAlreadyExists(name, this.fileStructure);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.featureFileService.saveFeatureFile(featureString, name)
            .then(function () {
                this.feature.isSaved = true;
                return this.featureFileService.getFeatureFileStructure();
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

    function parseFeatureFile (featureFile) {
        this.feature = this.featureParserService.parse(featureFile.tokens);
    }

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
