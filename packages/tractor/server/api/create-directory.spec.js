/* global describe:true, beforeEach:true, afterEach:true, it:true */
'use strict';

// Utilities:
var _ = require('lodash');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var createDirectory;

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var revert;

describe('server/api: create-directory:', function () {
    beforeEach(function () {
        createDirectory = rewire('./create-directory');
        /* eslint-disable no-underscore-dangle */
        revert = createDirectory.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should create a new directory:', function () {
        var fileStructure = {};
        var directory = {
            directories: []
        };
        var request = {
            body: {}
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);

        createDirectory = createDirectory();
        createDirectory(fileStructure, request);

        var newDirectory = _.last(directory.directories);
        expect(newDirectory.name).to.equal('New Directory');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should always make a unique name for the new directory:', function () {
        var fileStructure = {};
        var directory = {
            directories: [{
                name: 'New Directory'
            }]
        };
        var request = {
            body: {}
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);

        createDirectory = createDirectory();
        createDirectory(fileStructure, request);

        var newDirectory = _.last(directory.directories);
        expect(newDirectory.name).to.equal('New Directory (2)');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });
});
