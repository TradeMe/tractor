'use strict';

// Utilities:
var _ = require('lodash');

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
        literal: literal
    };

    function program (body) {
        return {
            type: 'Program',
            body: body || []
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
        return  {
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
};

Core.service('ASTCreatorService', ASTCreatorService);
