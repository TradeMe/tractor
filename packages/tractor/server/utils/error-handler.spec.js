/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var errorHandler = require('./error-handler');

describe('server/utils: error-handler:', function () {
    it('should log the error to the console', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };

        errorHandler(response, new Error(), 'error');

        expect(log.error).to.have.been.calledWith('error');

        log.error.restore();
    });

    it('should fall back to the `message` from the given `error`', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };

        errorHandler(response, new Error('error'));

        expect(log.error).to.have.been.calledWith('error');

        log.error.restore();
    });

    it('should update the `response` status to the `status` of the `error`', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        var error = new Error();
        error.status = 400;

        errorHandler(response, error);

        expect(response.status).to.have.been.calledWith(400);

        log.error.restore();
    });

    it('should fall back to a `status` of `500`', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');

        errorHandler(response, new Error());

        expect(response.status).to.have.been.calledWith(500);

        log.error.restore();
    });

    it('should response with the `message`', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'send');

        errorHandler(response, new Error(), 'error');

        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('error');

        log.error.restore();
    });

    it('should fall back to the `message` from the given `error`', function () {
        var log = require('../utils/logging');
        sinon.stub(log, 'error', noop);
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'send');

        errorHandler(response, new Error('error'));

        var responseData = JSON.parse(response.send.firstCall.args[0]);
        expect(responseData.error).to.equal('error');

        log.error.restore();
    });
});
