'use strict';

// Utilities:
var _ = require('lodash');
var pascal = require('change-case').pascal;

// Module:
var GherkinEditor = require('./GherkinEditor');

// Dependencies:
require('./Services/GherkinFileService');
require('./Services/GherkinParserService');
require('./Models/GherkinModel');

var GherkinEditorController = (function () {
    var GherkinEditorController = function GherkinEditorController (
        $window,
        GherkinFileService,
        GherkinParserService,
        GherkinModel,
        gherkinFileNames,
        featureFile
    ) {
        this.$window = $window;
        this.gherkinFileService = GherkinFileService;
        this.gherkinParserService = GherkinParserService;
        this.gherkinFileNames = gherkinFileNames;

        if (featureFile) {
            parseFeatureFile.call(this, featureFile);
        } else {
            this.gherkin = new GherkinModel();
        }

        Object.defineProperty(this, 'gherkinName', {
            get: function () {
                return pascal(this.gherkin.name);
            }
        });
    };

    GherkinEditorController.prototype.saveGherkin = function () {
        var gherkinFileNames = this.gherkinFileNames;
        var feature = this.gherkin.feature;
        var name = this.gherkinName;

        var exists = _.contains(gherkinFileNames, name);

        if (!exists || exists && this.$window.confirm('This will overwrite "' + name + '". Continue?')) {
            this.gherkinFileService.saveGherkinFile(name, feature)
            .then(function () {
                if (!exists) {
                    gherkinFileNames.push(name);
                }
            });
        }
    };

    function parseFeatureFile (featureFile) {
        try {
            this.gherkin = this.gherkinParserService.parse(featureFile.tokens);
        } catch (e) { }
    }

    return GherkinEditorController;
})();

GherkinEditor.controller('GherkinEditorController', GherkinEditorController);
