/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import Directory from '../file-structure/Directory';
import errorHandler from '../errors/error-handler';
import fileStructure from '../file-structure';
import File from '../files/File';
import transformers from './transformers';
import TractorError from '../errors/TractorError';

// Under test:
import editItemPath from './edit-item-path';

describe('server/api: edit-item-path:', () => {
    it('should edit the name of a directory', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;

        let directory = {
            delete: _.noop,
            directories: [],
            files: [],
            path: 'some/path/to/directory/oldName'
        };
        let parentDirectory = {
            addDirectory: _.noop,
            extension: '.js',
            path: 'some/path/to/directory'
        };
        let request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': parentDirectory,
            'some/path/to/directory/oldName': directory
        };

        sinon.stub(directory, 'delete').returns(Promise.resolve());
        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);

        return editItemPath.handler(request, response)
        .then(() => {
            expect(directory.delete).to.have.been.called();
            expect(Directory.prototype.save).to.have.been.called();

            let newDirectory = Directory.prototype.save.getCall(0).thisValue;
            expect(newDirectory.name).to.equal('newName');
            expect(newDirectory.path).to.equal('some/path/to/directory/newName');

        })
        .finally(() => {
            Directory.prototype.save.restore();
            fileStructure.getStructure.restore();

            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('shouldn\'t overwrite an existing directory with the given new name', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;

        let directory = {
            delete: _.noop,
            directories: [],
            files: [],
            path: 'some/path/to/directory/oldName'
        };
        let existingDirectory = {
            path: 'some/path/to/directory/newName'
        };
        let parentDirectory = {
            addDirectory: _.noop,
            extension: '.js',
            path: 'some/path/to/directory'
        };
        let request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': parentDirectory,
            'some/path/to/directory/oldName': directory,
            'some/path/to/directory/newName': existingDirectory
        };

        sinon.stub(directory, 'delete').returns(Promise.resolve());
        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);

        return editItemPath.handler(request, response)
        .then(() => {
            let newDirectory = Directory.prototype.save.getCall(0).thisValue;
            expect(newDirectory.name).to.equal('newName (1)');
            expect(newDirectory.path).to.equal('some/path/to/directory/newName (1)');
        })
        .finally(() => {
            Directory.prototype.save.restore();
            fileStructure.getStructure.restore();

            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('should edit the path of all the sub-directories in a directory', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;

        let subdirectory = {
            delete: _.noop,
            directories: [],
            files: [],
            path: 'some/path/to/directory/oldName/subDirectory'
        };
        let directory = {
            delete: _.noop,
            directories: [subdirectory],
            files: [],
            path: 'some/path/to/directory/oldName'
        };
        let parentDirectory = {
            addDirectory: _.noop,
            extension: '.js',
            path: 'some/path/to/directory'
        };
        let request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': parentDirectory,
            'some/path/to/directory/oldName': directory
        };

        sinon.stub(directory, 'delete').returns(Promise.resolve());
        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(subdirectory, 'delete').returns(Promise.resolve());

        return editItemPath.handler(request, response)
        .then(() => {
            let newSubdirectory = Directory.prototype.save.getCall(1).thisValue;
            expect(newSubdirectory.path).to.equal('some/path/to/directory/newName/subDirectory');

            expect(Directory.prototype.save).to.have.been.called();
            expect(subdirectory.delete).to.have.been.called();
        })
        .finally(() => {
            Directory.prototype.save.restore();
            fileStructure.getStructure.restore();

            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('should edit the path of all the files in a directory', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;

        let directory = {
            addFile: _.noop,
            delete: _.noop,
            directories: [],
            files: [],
            path: 'some/path/to/directory/oldName',
            type: 'components'
        };
        let file = new File('some/path/to/directory/oldName/file', directory);
        let parentDirectory = {
            addDirectory: _.noop,
            extension: '.js',
            path: 'some/path/to/directory'
        };
        let request = {
            body: {
                isDirectory: true,
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        directory.files.push(file);
        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': parentDirectory,
            'some/path/to/directory/oldName': directory
        };

        sinon.stub(directory, 'delete').returns(Promise.resolve());
        sinon.stub(Directory.prototype, 'save').returns(Promise.resolve());
        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(File.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(transformers, 'components').returns(Promise.resolve());

        return editItemPath.handler(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
            expect(File.prototype.save).to.have.been.called();

            let newFile = File.prototype.save.getCall(0).thisValue;
            expect(newFile.path).to.equal('some/path/to/directory/newName/file');
        })
        .finally(() => {
            Directory.prototype.save.restore();
            fileStructure.getStructure.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            transformers.components.restore();

            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('should edit the name of a file', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;
        let oldAllFilesByPath = fileStructure.allFilesByPath;

        let ast = {};
        let content = {};
        let directory = {
            addFile: _.noop,
            directories: [],
            extension: '.js',
            files: [],
            path: 'some/path/to/directory',
            type: 'components'
        };
        let file = new File('some/path/to/directory/oldName.js', directory);
        let request = {
            body: {
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let tokens = {};
        let structure = {};

        directory.files.push(file);
        file.ast = ast;
        file.content = content;
        file.tokens = tokens;
        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': directory
        };
        fileStructure.allFilesByPath = {
            'some/path/to/directory/oldName.js': file
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(File.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(transformers, 'components').returns(Promise.resolve());

        return editItemPath.handler(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
            expect(File.prototype.save).to.have.been.called();

            let newFile = File.prototype.save.getCall(0).thisValue;
            expect(newFile.name).to.equal('newName');
            expect(newFile.path).to.equal('some/path/to/directory/newName.js');
            expect(newFile.ast).to.equal(ast);
            expect(newFile.content).to.equal(content);
            expect(newFile.tokens).to.equal(tokens);
        })
        .finally(() => {
            fileStructure.getStructure.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            transformers.components.restore();

            fileStructure.allFilesByPath = oldAllFilesByPath;
            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('shouldn\'t overwrite an existing file with the given new name', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;
        let oldAllFilesByPath = fileStructure.allFilesByPath;

        let directory = {
            addFile: _.noop,
            directories: [],
            extension: '.js',
            files: [],
            path: 'some/path/to/directory',
            type: 'components'
        };
        let existingFile = new File('some/path/to/directory/newName.js', directory);
        let file = new File('some/path/to/directory/oldName.js', directory);
        let request = {
            body: {
                oldName: 'oldName',
                newName: 'newName',
                directoryPath: 'some/path/to/directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        directory.files.push(existingFile);
        directory.files.push(file);
        fileStructure.allDirectoriesByPath = {
            'some/path/to/directory': directory
        };
        fileStructure.allFilesByPath = {
            'some/path/to/directory/newName.js': existingFile,
            'some/path/to/directory/oldName.js': file
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(File.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(transformers, 'components').returns(Promise.resolve());

        return editItemPath.handler(request, response)
        .then(() => {
            let newFile = File.prototype.save.getCall(0).thisValue;
            expect(newFile.name).to.equal('newName (1)');
            expect(newFile.path).to.equal('some/path/to/directory/newName (1).js');
        })
        .finally(() => {
            fileStructure.getStructure.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            transformers.components.restore();

            fileStructure.allFilesByPath = oldAllFilesByPath;
            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('should update the directory path when moving a file', () => {
        let oldAllDirectoriesByPath = fileStructure.allDirectoriesByPath;
        let oldAllFilesByPath = fileStructure.allFilesByPath;

        let newDirectory = {
            addFile: _.noop,
            path: 'some/path/to/new-directory'
        };
        let oldDirectory = {
            addFile: _.noop,
            extension: '.js',
            path: 'some/path/to/old-directory',
            type: 'components'
        };
        let file = new File('some/path/to/old-directory/name.js', oldDirectory);
        let request = {
            body: {
                name: 'name',
                oldDirectoryPath: 'some/path/to/old-directory',
                newDirectoryPath: 'some/path/to/new-directory'
            },
            params: {}
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        fileStructure.allDirectoriesByPath = {
            'some/path/to/new-directory': newDirectory,
            'some/path/to/old-directory': oldDirectory
        };
        fileStructure.allFilesByPath = {
            'some/path/to/old-directory/name.js': file
        };

        sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
        sinon.stub(File.prototype, 'save').returns(Promise.resolve());
        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(transformers, 'components').returns(Promise.resolve());

        return editItemPath.handler(request, response)
        .then(() => {
            expect(File.prototype.delete).to.have.been.called();
            expect(File.prototype.save).to.have.been.called();

            let newFile = File.prototype.save.getCall(0).thisValue;
            expect(newFile.path).to.equal('some/path/to/new-directory/name.js');
        })
        .finally(() => {
            fileStructure.getStructure.restore();
            File.prototype.delete.restore();
            File.prototype.save.restore();
            transformers.components.restore();

            fileStructure.allFilesByPath = oldAllFilesByPath;
            fileStructure.allDirectoriesByPath = oldAllDirectoriesByPath;
        });
    });

    it('should throw an error if it gets options that it doesn\'t understand', () => {
        let request = {
            body: { }
        };
        let response = { };

        sinon.stub(errorHandler, 'handler');

        return editItemPath.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, new TractorError('Unknown operation', 500));
        })
        .finally(() => {
            errorHandler.handler.restore();
        });
    });
});
