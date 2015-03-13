/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var saveMockDataFile = require('./save-mock-data-file');

describe('server/actions: save-mock-data-file:', function () {
    it('should build the correct `dataPath` and save the `data` to a ".mock.json" file', function () {
        var fs = require('fs');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'mock',
                data: 'data'
            }
        };
        var response = {
            send: noop
        };

        return saveMockDataFile(request, response)
        .then(function () {
            expect(fs.writeFileAsync).to.have.been.calledWith('e2e_tests/mock_data/mock.mock.json', 'data');
        })
        .finally(function () {
            fs.writeFileAsync.restore();
        });
    });

    it('should return a success message to the client', function () {
        var fs = require('fs');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        var request = {
            body: {
                name: 'mock',
                data: 'data'
            }
        };
        var response = {
            send: noop
        };
        sinon.spy(response, 'send');

        return saveMockDataFile(request, response)
        .then(function () {
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.message).to.equal('"mock.mock.json" saved successfully.');
        })
        .finally(function () {
            fs.writeFileAsync.restore();
        });
    });

    it('should return an error if the mock data cannot be saved', function () {
        var fs = require('fs');
        var logging = require('../utils/logging');
        sinon.stub(fs, 'writeFileAsync').returns(Promise.reject(new Error()));
        sinon.stub(logging, 'error');
        var request = {
            body: {
                name: 'mock',
                data: 'data'
            }
        };
        var response = {
            status: noop,
            send: noop
        };
        sinon.spy(response, 'status');
        sinon.spy(response, 'send');

        return saveMockDataFile(request, response)
        .then(function () {
            expect(response.status).to.have.been.calledWith(500);
            var responseData = JSON.parse(response.send.firstCall.args[0]);
            expect(responseData.error).to.equal('Saving "mock.mock.json" failed.');
        })
        .finally(function () {
            fs.writeFileAsync.restore();
            logging.error.restore();
        });
    });
});
