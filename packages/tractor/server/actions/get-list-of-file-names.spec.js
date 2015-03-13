/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');

var noop = function () { };
var expect = chai.expect;
chai.use(sinonChai);

var getListOfFileNames = require('./get-list-of-file-names');

var createHandler = function () {
    var directory = 'directory';
    var extension = '.ext';
    return getListOfFileNames(directory, extension);
};

describe('server/actions: get-list-of-file-names:', function () {
    it('should return a handler for a given `directory` and `extension`', function () {
        var handler = createHandler();
        expect(handler).to.be.instanceof(Function);
    });

    describe('get-list-of-file-names handler:', function () {
        it('should return a list of files within the given `directory` that have the given `extension`', function () {
            var fs = require('fs');
            sinon.stub(fs, 'readdirAsync').returns(Promise.resolve(['file.ext', 'file.notext']));
            var response = {
                send: noop
            };
            sinon.spy(response, 'send');
            var handler = createHandler();

            return handler({}, response)
            .then(function () {
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                return expect(responseData[0]).to.equal('file');
            })
            .finally(function () {
                fs.readdirAsync.restore();
            });
        });

        it('should return an error if the `directory` cannot be read', function () {
            var fs = require('fs');
            var logging = require('../utils/logging');
            sinon.stub(fs, 'readdirAsync').returns(Promise.reject(new Error()));
            sinon.stub(logging, 'error');
            var response = {
                status: noop,
                send: noop
            };
            sinon.spy(response, 'status');
            sinon.spy(response, 'send');
            var handler = createHandler();

            return handler({}, response)
            .then(function () {
                expect(response.status).to.have.been.calledWith(500);
                var responseData = JSON.parse(response.send.firstCall.args[0]);
                expect(responseData.error).to.equal('Reading list of ".ext" files failed.');
            })
            .finally(function () {
                fs.readdirAsync.restore();
                logging.error.restore();
            });
        });
    });
});
