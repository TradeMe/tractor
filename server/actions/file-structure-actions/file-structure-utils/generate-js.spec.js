/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var expect = chai.expect;

var generateJS = require('./generate-js');

describe('server/ generate-js:', function () {
    it('should generate a JavaScript string from a file AST, including the leading block comment', function () {
        var file = {
            ast: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'module'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'exports'
                            }
                        },
                        right: {
                            type: 'Identifier',
                            name: 'test'
                        }
                    }
                }, {
                    type: 'FunctionDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'test'
                    },
                    params: [],
                    defaults: [],
                    body: {
                        type: 'BlockStatement',
                        body: []
                    },
                    rest: null,
                    generator: false,
                    expression: false
                }],
                comments: [{
                    type: 'Block',
                    value: ' test '
                }]
            }
        };

        generateJS(file);
        expect(file.content).to.equal('/* test */\nmodule.exports = test;\nfunction test() {\n}');
    });

    it('should throw a GenerateJavaScriptError when something goes wrong', function () {
        var file = {
            name: 'test'
        };
        expect(function () {
            generateJS(file);
        }).to.throw('Generating "test" failed.');
    });
});
