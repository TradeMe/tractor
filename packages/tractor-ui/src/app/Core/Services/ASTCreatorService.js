'use strict';

// Utilities:
var _ = require('lodash');
var estemplate = require('estemplate');

// Module:
var Core = require('../Core');

var ASTCreatorService = function () {
    var VariableDeclarationKinds = {
        VAR: 'var'
    };

    var AssignmentOperators = {
        ASSIGNMENT: '='
    };

    var UnaryOperators = {
        NEGATION: '-'
    };

    var BinaryOperators = {
        STRICT_INEQUALITY: '!=='
    };

    return {
        VariableDeclarationKinds: VariableDeclarationKinds,
        AssignmentOperators: AssignmentOperators,
        UnaryOperators: UnaryOperators,
        BinaryOperators: BinaryOperators,

        file: file,
        expression: expression,
        template: template,

        program: program,

        blockStatement: blockStatement,
        expressionStatement: expressionStatement,
        returnStatement: returnStatement,

        variableDeclaration: variableDeclaration,
        variableDeclarator: variableDeclarator,

        thisExpression: thisExpression,
        arrayExpression: arrayExpression,
        functionExpression: functionExpression,
        unaryExpression: unaryExpression,
        binaryExpression: binaryExpression,
        assignmentExpression: assignmentExpression,
        newExpression: newExpression,
        callExpression: callExpression,
        memberExpression: memberExpression,

        identifier: identifier,
        literal: literal,
        blockComment: blockComment
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

    function blockStatement (body) {
        return {
            type: 'BlockStatement',
            body: body || []
        };
    }

    function expressionStatement (expression) {
        return {
            type: 'ExpressionStatement',
            expression: expression
        };
    }

    function returnStatement (argument) {
        return {
            type: 'ReturnStatement',
            argument: argument
        };
    }

    function variableDeclaration (declarations, kind) {
        return {
            type: 'VariableDeclaration',
            declarations: declarations || [],
            kind: kind || VariableDeclarationKinds.VAR
        };
    }

    function variableDeclarator (id, init) {
        return {
            type: 'VariableDeclarator',
            id: id,
            init: init || null
        };
    }

    function thisExpression () {
        return {
            type: 'ThisExpression'
        };
    }

    function arrayExpression (elements) {
        return {
            type: 'ArrayExpression',
            elements: elements || []
        };
    }

    function functionExpression (id, params, body, defaults, rest, generator, expression) {
        return {
            type: 'FunctionExpression',
            id: id,
            params: params || [],
            body: body,
            defaults: defaults || [],
            rest: rest || null,
            generator: !!generator,
            expression: !!expression
        };
    }

    function unaryExpression (operator, argument, prefix) {
        return {
            type: 'UnaryExpression',
            operator: operator,
            argument: argument,
            prefix: !!prefix
        };
    }

    function binaryExpression (operator, left, right) {
        return {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right
        };
    }

    function assignmentExpression (left, operator, right) {
        return {
            type: 'AssignmentExpression',
            left: left,
            operator: operator,
            right: right
        };
    }

    function newExpression (callee, args) {
        return {
            type: 'NewExpression',
            callee: callee,
            arguments: args || []
        };
    }

    function callExpression (callee, args) {
        return {
            type: 'CallExpression',
            callee: callee,
            arguments: args || []
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
