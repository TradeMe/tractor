/* global describe:true, it:true */
'use strict';

// Utilities:
var Promise = require('bluebird');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var createTestDirectoryStructure = require('./create-test-directory-structure');

describe('server/cli/init: create-test-directory-structure:', function () {
    it('should create the root test directory', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');
        sinon.stub(log, 'success');

        return createTestDirectoryStructure.run('directory')
        .then(function () {
            expect(fs.mkdirAsync).to.have.been.calledWith('directory');
        })
        .finally(function () {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
            log.success.restore();
        });
    });

    it('should tell the user if the root test directory already exists', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        var error = new Promise.OperationalError();
        error.cause = {
            code: 'EEXIST'
        };
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(error));
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .then(function () {
            expect(log.warn).to.have.been.calledWith('"directory" directory already exists. Not creating folder structure...');
        })
        .finally(function () {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should rethrow any other errors', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'mkdirAsync').returns(Promise.reject(new Promise.OperationalError()));
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');

        return createTestDirectoryStructure.run('directory')
        .catch(function () {
            expect(log.warn.callCount).to.equal(0);
        })
        .finally(function () {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
        });
    });

    it('should create the subdirectory structure', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
		var path = require('path');
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');
        sinon.stub(log, 'success');

        return createTestDirectoryStructure.run('directory')
        .then(function () {
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'components'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'features'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'step_definitions'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'mock_data'));
            expect(fs.mkdirAsync).to.have.been.calledWith(path.join('directory', 'support'));
        })
        .finally(function () {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
            log.success.restore();
        });
    });

    it('should tell the user  what it is doing', function () {
        var fs = require('fs');
        var log = require('../../utils/logging');
        sinon.stub(fs, 'mkdirAsync').returns(Promise.resolve());
        sinon.stub(log, 'info');
        sinon.stub(log, 'warn');
        sinon.stub(log, 'success');

        return createTestDirectoryStructure.run('directory')
        .then(function () {
            expect(log.info).to.have.been.calledWith('Creating directory structure...');
            expect(log.success).to.have.been.calledWith('Directory structure created.');
        })
        .finally(function () {
            fs.mkdirAsync.restore();
            log.info.restore();
            log.warn.restore();
            log.success.restore();
        });
    });
});
