/* global describe:true, it:true, xit:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var saveStepDefinitionFile = require('./save-step-definition-file');

describe('server/actions: save-step-definition-file:', function () {
    it('should generate a JavaScript file from an AST and save it', function () {
        var escodegen = require('escodegen');
        var fs = require('fs');
        sinon.stub(escodegen, 'generate').returns('');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'step',
                program: {
                    body: null
                }
            }
        };
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');

        return saveStepDefinitionFile(request, response)
        .then(function () {
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.message).to.equal('"step" saved successfully.');
        })
        .finally(function () {
            escodegen.generate.restore();
            fs.writeFileAsync.restore();
        });
    });

    xit('should rebuild any Regular Expressions that it finds in the AST', function () {
        var escodegen = require('escodegen');
        var fs = require('fs');
        sinon.stub(escodegen, 'generate').returns('');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        var regexpLiteral = {
            type: 'Literal',
            raw: '/regexp/',
            value: '/regexp/'
        };
        var arrayRegexpLiteral = {
            type: 'Literal',
            raw: '/regexp/',
            value: '/regexp/'
        };
        var request = {
            body: {
                name: 'step',
                program: {
                    regexp: regexpLiteral,
                    nested: {
                        array: [arrayRegexpLiteral]
                    }
                }
            }
        };
        var response = {
            send: noop
        };

        return saveStepDefinitionFile(request, response)
        .then(function () {
            expect(regexpLiteral.value).to.deep.equal(/regexp/);
            expect(arrayRegexpLiteral.value).to.deep.equal(/regexp/);
        })
        .finally(function () {
            escodegen.generate.restore();
            fs.writeFileAsync.restore();
        });
    });

    it('should return an error if it cannot generate a JavaScript file', function () {
        var escodegen = require('escodegen');
        var logging = require('../../utils/logging');
        sinon.stub(escodegen, 'generate', function () {
            throw new Error();
        });
        sinon.stub(logging, 'error');
        var request = {
            body: {
                name: 'step',
                program: {}
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveStepDefinitionFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(400);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Invalid step definition.');
        })
        .finally(function () {
            escodegen.generate.restore();
            logging.error.restore();
        });
    });

    it('should return an error if the file cannot be saved', function () {
        var escodegen = require('escodegen');
        var fs = require('fs');
        var logging = require('../../utils/logging');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.reject(new Error()));
        sinon.stub(escodegen, 'generate').returns('');
        sinon.stub(logging, 'error');
        var request = {
            body: {
                name: 'step',
                program: {}
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveStepDefinitionFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(500);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Saving "step" failed.');
        })
        .finally(function () {
            escodegen.generate.restore();
            fs.writeFileAsync.restore();
            logging.error.restore();
        });
    });
});
