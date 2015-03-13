/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var openFile = require('./open-file');

describe('server/actions: open-file:', function () {
    it('should return a handler for a given `directory` and `options`', function () {
        var handler = openFile('components');
        expect(handler).to.be.instanceof(Function);
    });

    describe('open-file handler:', function () {
        it('should return the `contents` of the requested file', function () {
            var fs = require('fs');
            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('contents'));
            var request = {
                query: {}
            };
            var response = {
                send: noop
            };
            sinon.spy(response, 'send');
            var handler = openFile('components');

            return handler(request, response)
            .then(function () {
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.contents).to.equal('contents');
            })
            .finally(function () {
                fs.readFileAsync.restore();
            });
        });

        it('should return an error if the file cannot be read', function () {
            var fs = require('fs');
            var logging = require('../utils/logging');
            sinon.stub(fs, 'readFileAsync').returns(Promise.reject(new Error()));
            sinon.stub(logging, 'error');
            var request = {
                query: {
                    name: 'component'
                }
            };
            var response = {
                status: noop,
                send: noop
            };
            sinon.spy(response, 'status');
            sinon.spy(response, 'send');
            var handler = openFile('components');

            return handler(request, response)
            .then(function () {
                expect(response.status).to.have.been.calledWith(500);
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.error).to.equal('Reading "component.component.js" failed.');
            })
            .finally(function () {
                fs.readFileAsync.restore();
                logging.error.restore();
            });
        });
    });

    describe('open-file hander - parseJS: true:', function () {
        it('should also return the `ast` if the `parseJS` flag is used when creating the handler', function () {
            var fs = require('fs');
            var esprima = require('esprima');
            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
            sinon.stub(esprima, 'parse').returns({});
            var request = {
                query: {}
            };
            var response = {
                send: noop
            };
            sinon.spy(response, 'send');
            var handler = openFile('components', { parseJS: true });

            return handler(request, response)
            .then(function () {
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.ast).to.not.equal('undefined');
            })
            .finally(function () {
                fs.readFileAsync.restore();
                esprima.parse.restore();
            });
        });

        it('should return an error if the content cannot be parsed', function () {
            var fs = require('fs');
            var esprima = require('esprima');
            var logging = require('../utils/logging');
            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
            sinon.stub(esprima, 'parse', function () {
                throw new Error();
            });
            sinon.stub(logging, 'error');
            var request = {
                query: {
                    name: 'component'
                }
            };
            var response = {
                status: noop,
                send: noop
            };
            sinon.spy(response, 'status');
            sinon.spy(response, 'send');
            var handler = openFile('components', { parseJS: true });

            return handler(request, response)
            .then(function () {
                expect(response.status).to.have.been.calledWith(400);
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.error).to.equal('Parsing "component.component.js" failed.');
            })
            .finally(function () {
                fs.readFileAsync.restore();
                esprima.parse.restore();
                logging.error.restore();
            });
        });
    });

    describe('open-file hander - lexGherkin: true:', function () {
        it('should also return the `tokens` if the `lexGherkin` flag is used when creating the handler', function () {
            var fs = require('fs');
            var gherkin = require('gherkin');
            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
            sinon.stub(gherkin, 'Lexer').returns(function () {
                this.scan = function () { };
            });
            var request = {
                query: {}
            };
            var response = {
                send: noop
            };
            sinon.spy(response, 'send');
            var handler = openFile('features', { lexGherkin: true });

            return handler(request, response)
            .then(function () {
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.tokens).to.not.equal('undefined');
            })
            .finally(function () {
                fs.readFileAsync.restore();
                gherkin.Lexer.restore();
            });
        });

        it('should return an error if the content cannot be lexed', function () {
            var fs = require('fs');
            var gherkin = require('gherkin');
            var logging = require('../utils/logging');
            sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
            sinon.stub(gherkin, 'Lexer').returns(function () {
                this.scan = function () {
                    throw new Error();
                };
            });
            sinon.stub(logging, 'error');
            var request = {
                query: {
                    name: 'feature'
                }
            };
            var response = {
                status: noop,
                send: noop
            };
            sinon.spy(response, 'status');
            sinon.spy(response, 'send');
            var handler = openFile('features', { lexGherkin: true });

            return handler(request, response)
            .then(function () {
                expect(response.status).to.have.been.calledWith(400);
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.error).to.equal('Lexing "feature.feature" failed.');
            })
            .finally(function () {
                fs.readFileAsync.restore();
                gherkin.Lexer.restore();
                logging.error.restore();
            });
        });
    });
});
