'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var Core = require('../Core');

var ASTCreatorService =  function () {
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

        createProgram: createProgram,

        createBlockStatement: createBlockStatement,
        createExpressionStatement: createExpressionStatement,
        createReturnStatement: createReturnStatement,

        createVariableDeclaration: createVariableDeclaration,
        createVariableDeclarator: createVariableDeclarator,

        createThisExpression: createThisExpression,
        createArrayExpression: createArrayExpression,
        createFunctionExpression: createFunctionExpression,
        createUnaryExpression: createUnaryExpression,
        createBinaryExpression: createBinaryExpression,
        createAssignmentExpression: createAssignmentExpression,
        createNewExpression: createNewExpression,
        createCallExpression: createCallExpression,
        createMemberExpression: createMemberExpression,

        createIdentifier: createIdentifier,
        createLiteral: createLiteral,
    };

    function createProgram (statements) {
        return {
            type: 'Program',
            body: statements || []
        };
    }

    function createBlockStatement (body) {
        return {
            type: 'BlockStatement',
            body: body || []
        };
    }

    function createExpressionStatement (expression) {
        return {
            type: 'ExpressionStatement',
            expression: expression
        };
    }

    function createReturnStatement (arg) {
        return {
            type: 'ReturnStatement',
            argument: arg
        };
    }

    function createVariableDeclaration (declarations, kind) {
        return {
            type: 'VariableDeclaration',
            declarations: declarations || [],
            kind: kind || VariableDeclarationKinds.VAR
        };
    }

    function createVariableDeclarator (id, init) {
        return {
            type: 'VariableDeclarator',
            id: id,
            init: init || null
        };
    }

    function createThisExpression () {
        return {
            type: 'ThisExpression'
        };
    }

    function createArrayExpression (elements) {
        return {
            type: 'ArrayExpression',
            elements: elements || []
        };
    }

    function createFunctionExpression (id, params, body, defaults, rest, generator, expression) {
        return {
            type: 'FunctionExpression',
            id: id,
            params: params || [],
            body: body,
            defaults: defaults || [],
            rest: null,
            generator: !!generator,
            expression: !!expression
        };
    }

    function createUnaryExpression (operator, argument, isPrefix) {
        return {
            type: 'UnaryExpression',
            operator: operator,
            argument: argument,
            prefix: isPrefix
        };
    }

    function createBinaryExpression (operator, left, right) {
        return {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right
        };
    }

    function createAssignmentExpression (left, operator, right) {
        return {
            type: 'AssignmentExpression',
            left: left,
            operator: operator,
            right: right
        };
    }

    function createNewExpression (callee, args) {
        return {
            type: 'NewExpression',
            callee: callee,
            arguments: args || []
        };
    }

    function createCallExpression (callee, args) {
        return {
            type: 'CallExpression',
            callee: callee,
            arguments: args || []
        };
    }

    function createMemberExpression (object, property, computed) {
        return  {
            type: 'MemberExpression',
            object: object,
            property: property,
            computed: !!computed
        };
    }

    function createIdentifier (name) {
        return {
            type: 'Identifier',
            name: name
        };
    }

    function createLiteral (value) {
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
