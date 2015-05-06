/* global describe:true, it:true */
'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;
chai.use(sinonChai);

var getConfig = require('./create-config');

describe('server/utils: create-config:', function () {
    it('returns the default config when there is not a `tractor.conf.js` file', function () {
        var path = require('path');
        sinon.stub(path, 'join').returns('');

        var config = getConfig();

        expect(config.testDirectory).to.equal('./e2e_tests');
        expect(config.port).to.equal(4000);

        path.join.restore();
    });

    it('returns the custom values from a `tractor.conf.js` file', function () {
        var path = require('path');
        sinon.stub(path, 'join').returns(process.cwd() + '/server/utils/create-config.mock.js');

        var config = getConfig();

        expect(config.testDirectory).to.equal('./tests');

        path.join.restore();
    });

    it('returns default values for properties that are not overridden by the user', function () {
        var path = require('path');
        sinon.stub(path, 'join').returns(process.cwd() + '/server/utils/create-config.mock');

        var config = getConfig();

        expect(config.port).to.equal(4000);

        path.join.restore();
    });
});
