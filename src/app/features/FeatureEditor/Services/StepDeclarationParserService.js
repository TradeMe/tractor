'use strict';

// Module:
var FeatureEditor = require('../FeatureEditor');

// Dependencies
require('../Models/StepDeclarationModel');

var StepDeclarationParserService = function ExampleParserService (StepDeclarationModel) {
    return {
        parse: parse
    };

    function parse (tokens) {
        var stepDeclaration = new StepDeclarationModel();

        stepDeclaration.type = tokens.type;
        stepDeclaration.step = tokens.step;

        return stepDeclaration;
    }
};

FeatureEditor.service('StepDeclarationParserService', StepDeclarationParserService);
