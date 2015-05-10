/* global describe:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Utilities:
var path = require('path');
var Promise = require('bluebird');

// Under test:
var createBaseTestFiles = require('./create-base-test-files');

describe('server/cli/init: create-base-test-files:', function () {
    it('should copy the "world.js" file to the "support" folder in the users specified directory', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('world'));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return createBaseTestFiles.run('')
        .then(function () {
            expect(fs.readFileAsync).to.have.been.calledWith(path.join(__dirname, '/base_file_sources/world.js'));
            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(process.cwd(), '/support/world.js'), 'world');
        })
        .finally(function () {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user if "world.js" already exists', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'openAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'warn');

        return createBaseTestFiles.run('')
        .then(function () {
            expect(log.warn).to.have.been.calledWith('"world.js" already exists. Not copying...');
        })
        .finally(function () {
            fs.openAsync.restore();
            log.warn.restore();
        });
    });

    it('should copy the "protractor.conf.js" file to the users specified directory', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('config'));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return createBaseTestFiles.run('')
        .then(function () {
            expect(fs.readFileAsync).to.have.been.calledWith(path.join(__dirname, '/base_file_sources/protractor.conf.js'));
            expect(fs.writeFileAsync).to.have.been.calledWith(path.join(process.cwd(), '/protractor.conf.js'), 'config');
        })
        .finally(function () {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });

    it('should tell the user if "protractor.conf.js" already exists', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'openAsync').returns(Promise.resolve(''));
        sinon.stub(log, 'warn');

        return createBaseTestFiles.run('')
        .then(function () {
            expect(log.warn).to.have.been.calledWith('"protractor.conf.js" already exists. Not copying...');
        })
        .finally(function () {
            fs.openAsync.restore();
            log.warn.restore();
        });
    });

    it('should tell the user what it is doing', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'openAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(fs, 'readFileAsync').returns(Promise.resolve(''));
        sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'success');

        return createBaseTestFiles.run('')
        .then(function () {
            expect(log.info).to.have.been.calledWith('Creating "world.js"...');
            expect(log.info).to.have.been.calledWith('Creating "protractor.conf.js"...');
            expect(log.success).to.have.been.calledWith('"world.js" created.');
            expect(log.success).to.have.been.calledWith('"protractor.conf.js" created.');
        })
        .finally(function () {
            fs.openAsync.restore();
            fs.readFileAsync.restore();
            fs.writeFileAsync.restore();
            log.info.restore();
            log.success.restore();
        });
    });
});
