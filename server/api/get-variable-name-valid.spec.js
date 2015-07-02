/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Utilities:
var _ = require('lodash');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var getVariableNameValid = require('./get-variable-name-valid');

describe('server/api: get-variable-name-valid:', function () {
    it('should return true if the given `variableName` is a valid JavaScript variable name', function () {
        var charFunk = require('CharFunk');
        sinon.stub(charFunk, 'isValidName').returns(true);
        var request = {
            query: {
                variableName: ''
            }
        };
        var response = {
            send: _.noop
        };
        sinon.spy(response, 'send');

        getVariableNameValid(request, response);

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
            query: {
                variableName: ''
            }
        };
        var response = {
            status: _.noop,
            send: _.noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        getVariableNameValid(request, response);

        expect(response.status).to.have.been.calledWith(400);
        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('Invalid name.');

        charFunk.isValidName.restore();
        logging.error.restore();
    });
});
