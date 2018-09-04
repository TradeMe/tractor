'use strict';

// Utilities:
var _ = require('lodash');
var estemplate = require('estemplate');

// Module:
var Core = require('../Core');

var ASTCreatorService = function () {
    return {
        file: file,
        expression: expression,
        template: template,

        expressionStatement: expressionStatement,
        identifier: identifier,
        literal: literal,
        memberExpression: memberExpression
    };

    function file (expression, meta) {
        return program([expressionStatement(expression)], [blockComment(meta)]);
    }

    function expression (template, objects) {
        var ast = _.first(estemplate(template, objects || {}).body);
        return ast ? ast.expression || ast.value || ast : null;
    }

    function template (template, objects) {
        return _.first(estemplate(template, objects || {}).body);
    }

    function program (body, comments) {
        return {
            type: 'Program',
            body: body || [],
            comments: comments || []
        };
    }

    function expressionStatement (expression) {
        return {
            type: 'ExpressionStatement',
            expression: expression
        };
    }

    function memberExpression (object, property, computed) {
        return {
            type: 'MemberExpression',
            object: object,
            property: property,
            computed: !!computed
        };
    }

    function identifier (name) {
        return {
            type: 'Identifier',
            name: name
        };
    }

    function literal (value) {
        var literal = {
            type: 'Literal',
            value: value
        };
        if (_.isRegExp(value)) {
          literal.raw = '' + value;
        }
        return literal;
    }

    function blockComment (value) {
        return {
            type: 'Block',
            value: value
        };
    }
};

Core.service('astCreatorService', ASTCreatorService);
