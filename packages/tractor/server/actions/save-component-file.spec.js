/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var saveComponentFile = require('./save-component-file');

describe('server/actions: save-component-file:', function () {
    it('should generate a JavaScript file from an AST and save it', function () {
        var escodegen = require('escodegen');
        var fs = require('fs');
        sinon.stub(escodegen, 'generate').returns('');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'component'
            }
        };
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');

        return saveComponentFile(request, response)
        .then(function () {
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.message).to.equal('"component.component.js" saved successfully.');
        })
        .finally(function () {
            escodegen.generate.restore();
            fs.writeFileAsync.restore();
        });
    });

    it('should return an error if it cannot generate a JavaScript file', function () {
        var escodegen = require('escodegen');
        var logging = require('../utils/logging');
        sinon.stub(escodegen, 'generate', function () {
            throw new Error();
        });
        sinon.stub(logging, 'error');
        var request = {
            body: {
                name: 'component'
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveComponentFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(400);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Invalid component.');
        })
        .finally(function () {
            escodegen.generate.restore();
            logging.error.restore();
        });
    });

    it('should return an error if the file cannot be saved', function () {
        var escodegen = require('escodegen');
        var fs = require('fs');
        var logging = require('../utils/logging');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.reject(new Error()));
        sinon.stub(escodegen, 'generate').returns('');
        sinon.stub(logging, 'error');
        var request = {
            body: {
                name: 'component'
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveComponentFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(500);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Saving "component.component.js" failed.');
        })
        .finally(function () {
            escodegen.generate.restore();
            fs.writeFileAsync.restore();
            logging.error.restore();
        });
    });
});
