'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

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

GherkinEditor.service('StepDeclarationParserService', StepDeclarationParserService);
