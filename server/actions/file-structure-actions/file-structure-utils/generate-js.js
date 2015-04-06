'use strict';

// Utilities:
var _ = require('lodash');

// Dependencies:
var escodegen = require('escodegen');
var esquery = require('esquery');

// Errors:
var GenerateJavaScriptError = require('../../../Errors/GenerateJavaScriptError');

module.exports = generateJS;

function generateJS (file) {
    try {
        var moduleAssignmentExpression = _.first(esquery.query(file.ast, 'AssignmentExpression'));
        moduleAssignmentExpression.leadingComments = file.ast.comments;
        file.content = escodegen.generate(file.ast, {
            comment: true
        });
        delete file.ast;
    } catch (e) {
        throw new GenerateJavaScriptError('Generating "' + file.name + '" failed.');
    }
}
