/* global describe:true, beforeEach: true, afterEach:true, it:true */
'use strict';

// Utilities:
var _ = require('lodash');

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var noop = require('node-noop').noop;
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var editItemPath;

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var transformsMock = {
    test: noop
};
var revert;

describe('server/api: edit-item-path:', function () {
    beforeEach(function () {
        editItemPath = rewire('./edit-item-path');
        /* eslint-disable no-underscore-dangle */
        revert = editItemPath.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock,
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */
    });

    afterEach(function () {
        revert();
    });

    it('should rename a directory:', function () {
        var path = require('path');

        var fileStructure = { };
        var directory = { };
        var request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension');
        var findDirectory = sinon.stub(fileStructureUtilsMock, 'findDirectory');
        findDirectory.onCall(0).returns(directory);
        findDirectory.returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(directory.name).to.equal('newName');
        expect(directory.path).to.equal(path.join('directory-path', 'newName'));

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should delete all the paths of any files within the directory:', function () {
        var fileStructure = { };
        var directory = {
            files: [{
                path: 'path'
            }]
        };
        var request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension');
        var findDirectory = sinon.stub(fileStructureUtilsMock, 'findDirectory');
        findDirectory.onCall(0).returns(directory);
        findDirectory.returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(_.first(directory.files).path).to.be.undefined();

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should ensure the new path of the directory is unique:', function () {
        var path = require('path');

        var fileStructure = { };
        var directory = { };
        var existingDirectoryWithSameName = { };
        var request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension');
        var findDirectory = sinon.stub(fileStructureUtilsMock, 'findDirectory');
        findDirectory.onCall(0).returns(directory);
        findDirectory.onCall(1).returns(existingDirectoryWithSameName);
        findDirectory.returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(directory.name).to.equal('newName (2)');
        expect(directory.path).to.equal(path.join('directory-path', 'newName (2)'));

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should transform all the paths of all files within the directory:', function () {
        var fileStructure = { };
        var directory = {
            allFiles: [{
                name: 'file1'
            }, {
                name: 'file2'
            }]
        };
        var existingDirectoryWithSameName = { };
        var request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('test');
        var findDirectory = sinon.stub(fileStructureUtilsMock, 'findDirectory');
        findDirectory.onCall(0).returns(directory);
        findDirectory.onCall(1).returns(existingDirectoryWithSameName);
        findDirectory.returns(null);
        var transform = sinon.spy(transformsMock, 'test');

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(transform.callCount).to.equal(2);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
    });

    it('should rename a file:', function () {
        var fileStructure = { };
        var directory = { };
        var file = { };
        var request = {
            body: {
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('test');
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        var findFile = sinon.stub(fileStructureUtilsMock, 'findFile');
        findFile.onCall(0).returns(file);
        findFile.returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(file.name).to.equal('newName');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should ensure the new path of the directory is unique:', function () {
        var fileStructure = { };
        var directory = { };
        var file = { };
        var existingFileWithSameName = { };
        var request = {
            body: {
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('test');
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        var findFile = sinon.stub(fileStructureUtilsMock, 'findFile');
        findFile.onCall(0).returns(file);
        findFile.onCall(1).returns(existingFileWithSameName);
        findFile.returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(file.name).to.equal('newName (2)');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should move a file:', function () {
        var fileStructure = { };
        var file = {
            name: 'file'
        };
        var oldDirectory = {
            files: [file]
        };
        var newDirectory = {
            files: []
        };
        var request = {
            body: {
                name: 'name',
                oldDirectoryPath: 'old-directory-path',
                newDirectoryPath: 'new-directory-path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('test');
        var findDirectory = sinon.stub(fileStructureUtilsMock, 'findDirectory');
        findDirectory.onCall(0).returns(oldDirectory);
        findDirectory.onCall(1).returns(newDirectory);
        sinon.stub(fileStructureUtilsMock, 'findFile').returns(file);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(oldDirectory.files.length).to.equal(0);
        expect(_.last(newDirectory.files)).to.equal(file);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });
});
