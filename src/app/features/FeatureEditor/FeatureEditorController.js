'use strict';

// Utilities:
var _ = require('lodash');
var pascal = require('change-case').pascal;

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
        featureFileNames,
        featureFile
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.notifierService = NotifierService;

        this.featureFileService = FeatureFileService;
        this.featureParserService = FeatureParserService;
        this.featureFileNames = featureFileNames;

        if (featureFile) {
            parseFeatureFile.call(this, featureFile);
        } else {
            this.feature = new FeatureModel();
        }

        Object.defineProperty(this, 'featureName', {
            get: function () {
                return pascal(this.feature.name);
            }
        });
    };

    FeatureEditorController.prototype.saveFeatureFile = function () {
        var featureFileNames = this.featureFileNames;
        var featureString = this.feature.featureString;
        var name = this.featureName;

        var exists = _.contains(featureFileNames, name);

        if (!exists || this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.featureFileService.saveFeatureFile(featureString, name)
            .then(function () {
                if (!exists) {
                    featureFileNames.push(name);
                }
            });
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
        try {
            this.feature = this.featureParserService.parse(featureFile.tokens);
        } catch (e) { }
    }

    return FeatureEditorController;
})();

FeatureEditor.controller('FeatureEditorController', FeatureEditorController);
