/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');

// Test setup:
var expect = chai.expect;

// Testing:
require('./ASTCreatorService');
var astCreatorService;

describe('ASTCreatorService.js:', function () {
    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.inject(function (_astCreatorService_) {
            astCreatorService = _astCreatorService_;
        });
    });

    describe('ASTCreatorService.program:', function () {
        it('should create a new `program` object:', function () {
            var body = [];
            var program = astCreatorService.program(body);
            expect(program.type).to.equal('Program');
            expect(program.body).to.equal(body);
        });

        it('should set `body` to an empty array by default:', function () {
            var program = astCreatorService.program();
            expect(program.body).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.blockStatement:', function () {
        it('should create a new `blockStatement` object:', function () {
            var body = [];
            var blockStatement = astCreatorService.blockStatement(body);
            expect(blockStatement.type).to.equal('BlockStatement');
            expect(blockStatement.body).to.equal(body);
        });

        it('should set `body` to an empty array by default:', function () {
            var blockStatement = astCreatorService.blockStatement();
            expect(blockStatement.body).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.expressionStatement:', function () {
        it('should create a new `expressionStatement` object:', function () {
            var expression = {};
            var expressionStatement = astCreatorService.expressionStatement(expression);
            expect(expressionStatement.type).to.equal('ExpressionStatement');
            expect(expressionStatement.expression).to.equal(expression);
        });
    });

    describe('ASTCreatorService.returnStatement:', function () {
        it('should create a new `returnStatement` object:', function () {
            var argument = {};
            var returnStatement = astCreatorService.returnStatement(argument);
            expect(returnStatement.type).to.equal('ReturnStatement');
            expect(returnStatement.argument).to.equal(argument);
        });
    });

    describe('ASTCreatorService.variableDeclaration:', function () {
        it('should create a new `variableDeclaration` object:', function () {
            var declarations = {};
            var kind = {};
            var variableDeclaration = astCreatorService.variableDeclaration(declarations, kind);
            expect(variableDeclaration.type).to.equal('VariableDeclaration');
            expect(variableDeclaration.declarations).to.equal(declarations);
            expect(variableDeclaration.kind).to.equal(kind);
        });

        it('should set `declarations` to an empty array by default:', function () {
            var variableDeclaration = astCreatorService.variableDeclaration();
            expect(variableDeclaration.declarations).to.be.an.instanceof(Array);
        });

        it('should set `kind` to `ASTCreatorService.VariableDeclarationKinds.VAR` by default', function () {
            var variableDeclaration = astCreatorService.variableDeclaration();
            expect(variableDeclaration.kind).to.equal(astCreatorService.VariableDeclarationKinds.VAR);
        });
    });

    describe('ASTCreatorService.variableDeclarator:', function () {
        it('should create a new `variableDeclarator` object:', function () {
            var id = {};
            var init = {};
            var variableDeclarator = astCreatorService.variableDeclarator(id, init);
            expect(variableDeclarator.type).to.equal('VariableDeclarator');
            expect(variableDeclarator.id).to.equal(id);
            expect(variableDeclarator.init).to.equal(init);
        });

        it('should set `init` to `null` by default:', function () {
            var variableDeclarator = astCreatorService.variableDeclarator();
            expect(variableDeclarator.init).to.equal(null);
        });
    });

    describe('ASTCreatorService.thisExpression:', function () {
        it('should create a new `thisExpression` object:', function () {
            var thisExpression = astCreatorService.thisExpression();
            expect(thisExpression.type).to.equal('ThisExpression');
        });
    });

    describe('ASTCreatorService.arrayExpression:', function () {
        it('should create a new `arrayExpression` object:', function () {
            var elements = {};
            var arrayExpression = astCreatorService.arrayExpression(elements);
            expect(arrayExpression.type).to.equal('ArrayExpression');
            expect(arrayExpression.elements).to.equal(elements);
        });

        it('should set `elements` to an empty array by default:', function () {
            var arrayExpression = astCreatorService.arrayExpression();
            expect(arrayExpression.elements).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.functionExpression:', function () {
        it('should create a new `functionExpression` object:', function () {
            var id = {};
            var params = {};
            var body = {};
            var defaults = {};
            var rest = {};
            var generator = {};
            var expression = {};
            var functionExpression = astCreatorService.functionExpression(id, params, body, defaults, rest, generator, expression);
            expect(functionExpression.type).to.equal('FunctionExpression');
            expect(functionExpression.id).to.equal(id);
            expect(functionExpression.params).to.equal(params);
            expect(functionExpression.body).to.equal(body);
            expect(functionExpression.defaults).to.equal(defaults);
            expect(functionExpression.rest).to.equal(rest);
            expect(functionExpression.generator).to.equal(true);
            expect(functionExpression.expression).to.equal(true);
        });

        it('should set `params` to an empty array by default:', function () {
            var functionExpression = astCreatorService.functionExpression();
            expect(functionExpression.params).to.be.an.instanceof(Array);
        });

        it('should set `defaults` to an empty array by default:', function () {
            var functionExpression = astCreatorService.functionExpression();
            expect(functionExpression.defaults).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.unaryExpression:', function () {
        it('should create a new `unaryExpression` object:', function () {
            var operator = {};
            var argument = {};
            var prefix = {};
            var unaryExpression = astCreatorService.unaryExpression(operator, argument, prefix);
            expect(unaryExpression.type).to.equal('UnaryExpression');
            expect(unaryExpression.operator).to.equal(operator);
            expect(unaryExpression.argument).to.equal(argument);
            expect(unaryExpression.prefix).to.equal(true);
        });
    });

    describe('ASTCreatorService.binaryExpression:', function () {
        it('should create a new `binaryExpression` object:', function () {
            var operator = {};
            var left = {};
            var right = {};
            var binaryExpression = astCreatorService.binaryExpression(operator, left, right);
            expect(binaryExpression.type).to.equal('BinaryExpression');
            expect(binaryExpression.operator).to.equal(operator);
            expect(binaryExpression.left).to.equal(left);
            expect(binaryExpression.right).to.equal(right);
        });
    });

    describe('ASTCreatorService.assignmentExpression:', function () {
        it('should create a new `assignmentExpression` object:', function () {
            var left = {};
            var operator = {};
            var right = {};
            var assignmentExpression = astCreatorService.assignmentExpression(left, operator, right);
            expect(assignmentExpression.type).to.equal('AssignmentExpression');
            expect(assignmentExpression.left).to.equal(left);
            expect(assignmentExpression.operator).to.equal(operator);
            expect(assignmentExpression.right).to.equal(right);
        });
    });

    describe('ASTCreatorService.newExpression:', function () {
        it('should create a new `newExpression` object:', function () {
            var callee = {};
            var args = {};
            var newExpression = astCreatorService.newExpression(callee, args);
            expect(newExpression.type).to.equal('NewExpression');
            expect(newExpression.callee).to.equal(callee);
            expect(newExpression.arguments).to.equal(args);
        });

        it('should set `elements` to an empty array by default:', function () {
            var newExpression = astCreatorService.newExpression();
            expect(newExpression.arguments).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.callExpression:', function () {
        it('should create a new `callExpression` object:', function () {
            var callee = {};
            var args = {};
            var callExpression = astCreatorService.callExpression(callee, args);
            expect(callExpression.type).to.equal('CallExpression');
            expect(callExpression.callee).to.equal(callee);
            expect(callExpression.arguments).to.equal(args);
        });

        it('should set `elements` to an empty array by default:', function () {
            var callExpression = astCreatorService.callExpression();
            expect(callExpression.arguments).to.be.an.instanceof(Array);
        });
    });

    describe('ASTCreatorService.memberExpression:', function () {
        it('should create a new `memberExpression` object:', function () {
            var object = {};
            var property = {};
            var computed = {};
            var memberExpression = astCreatorService.memberExpression(object, property, computed);
            expect(memberExpression.type).to.equal('MemberExpression');
            expect(memberExpression.object).to.equal(object);
            expect(memberExpression.property).to.equal(property);
            expect(memberExpression.computed).to.equal(true);
        });
    });

    describe('ASTCreatorService.identifier:', function () {
        it('should create a new `identifier` object:', function () {
            var name = {};
            var identifier = astCreatorService.identifier(name);
            expect(identifier.type).to.equal('Identifier');
            expect(identifier.name).to.equal(name);
        });
    });

    describe('ASTCreatorService.literal:', function () {
        it('should create a new `literal` object:', function () {
            var value = {};
            var literal = astCreatorService.literal(value);
            expect(literal.type).to.equal('Literal');
            expect(literal.value).to.equal(value);
        });

        it('should have the `raw` value if the literal is a RegExp:', function () {
            var value = /RegExp/;
            var literal = astCreatorService.literal(value);
            expect(literal.raw).to.equal('/RegExp/');
        });
    });

    describe('ASTCreatorService.blockComment:', function () {
        it('should create a new `blockComment` object:', function () {
            var value = '';
            var literal = astCreatorService.blockComment(value);
            expect(literal.type).to.equal('Block');
            expect(literal.value).to.equal(value);
        });
    });
});
