'use strict';

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
        FeatureFileService,
        FeatureModel,
        featureFileStructure,
        featurePath
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.featureFileService = FeatureFileService;

        this.fileStructure = featureFileStructure;

        if (featurePath) {
            this.feature = this.featureFileService.openFeature(this.fileStructure, featurePath.path);
        }
        this.feature = this.feature || new FeatureModel();
    };

    FeatureEditorController.prototype.saveFeatureFile = function () {
        this.featureFileService.getFeaturePath({
            name: this.feature.name,
            path: this.feature.path
        })
        .then(function (featurePath) {
            var exists = this.featureFileService.checkFeatureExists(this.fileStructure, featurePath.path);

            if (!exists || this.$window.confirm('This will overwrite "' + this.feature.name + '". Continue?')) {
                this.featureFileService.saveFeature({
                    feature: this.feature.featureString,
                    name: this.feature.name,
                    path: featurePath.path
                })
                .then(function () {
                    return this.featureFileService.getFeatureFileStructure();
                }.bind(this))
                .then(function (featureFileStructure) {
                    this.fileStructure = featureFileStructure;
                    this.mockData = this.featureFileService.openFeature(this.fileStructure, featurePath.path);
                }.bind(this));
            }
        }.bind(this));
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

    return FeatureEditorController;
})();

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
