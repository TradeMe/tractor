/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var validateJavaScriptVariableName = require('./validate-javascript-variable-name');

describe('server/actions: validate-javascript-variable-name:', function () {
    it('should return true if the given `variableName` is a valid JavaScript variable name', function () {
        var charFunk = require('CharFunk');
        sinon.stub(charFunk, 'isValidName').returns(true);
        var request = {
            body: {
                variableName: ''
            }
        };
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');

        validateJavaScriptVariableName(request, response);

        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.result).to.equal(true);

        charFunk.isValidName.restore();
    });

    it('should return an error if the given `variableName` is a not valid JavaScript variable name', function () {
        var charFunk = require('CharFunk');
        var logging = require('../utils/logging');
        sinon.stub(charFunk, 'isValidName').returns(false);
        sinon.stub(logging, 'error');
        var request = {
            body: {
                variableName: ''
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        validateJavaScriptVariableName(request, response);

        expect(response.status).to.have.been.calledWith(400);
        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('Invalid variable name.');

        charFunk.isValidName.restore();
        logging.error.restore();
    });
});
