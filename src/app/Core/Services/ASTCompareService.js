'use strict';

// Module:
var Core = require('../Core');

// Dependencies:
var deepEqual = require('deep-equal')
var esquery = require('esquery');

var ASTCompareService = function () {
    return { compare };

    function compare (a, b) {
        // There are some version mismatches between
        // different estools. We modify the ASTs to ensure
        // they have the same expected properties:
        downgradeProgram(a);
        downgradeProgram(b);
        downgradeFunctionExpressions(a);
        downgradeFunctionExpressions(b);
        downgradeStringLiterals(a);
        downgradeStringLiterals(a);

        return deepEqual(a, b);
    }

    function downgradeProgram (ast) {
        esquery(ast, 'Program').forEach(program => {
            delete program.sourceType;
        });
    }

    function downgradeFunctionExpressions (ast) {
        esquery(ast, 'FunctionExpression').forEach(functionExpression => {
            delete functionExpression.async;
            delete functionExpression.defaults;
            delete functionExpression.rest;
        });
    }

    function downgradeStringLiterals (ast) {
        esquery(ast, 'Literal[raw=/^\'.*\'|null$/]').forEach(stringLiteral => {
            delete stringLiteral.raw;
        });
    }
};

Core.service('astCompareService', ASTCompareService);
