/* global describe:true, beforeEach:true, afterEach:true, it:true */
'use strict';

// Test Utilities:
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

// Utilities:
var _ = require('lodash');

// Test setup:
var expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Under test:
var editItemPath;

// Mocks:
var fileStructureModiferMock = require('../utils/file-structure-modifier.mock');
var fileStructureUtilsMock = require('../utils/file-structure-utils/file-structure-utils.mock');
var revert;

describe('server/api: edit-item-path:', function () {
    beforeEach(function () {
        editItemPath = rewire('./edit-item-path');
        /* eslint-disable no-underscore-dangle */
        revert = editItemPath.__set__({
            fileStructureModifier: fileStructureModiferMock,
            fileStructureUtils: fileStructureUtilsMock
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(directory.name).to.equal('newName');
        expect(directory.path).to.equal(path.join('directory-path', 'newName'));

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(_.first(directory.files).path).to.be.undefined();

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(directory.name).to.equal('newName (2)');
        expect(directory.path).to.equal(path.join('directory-path', 'newName (2)'));

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */
        var transform = sinon.spy(transformsMock, 'test');

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(transform.callCount).to.equal(2);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(file.name).to.equal('newName');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(file.name).to.equal('newName (2)');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
        revertTransforms();
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
        var transformsMock = {
            test: _.noop
        };
        /* eslint-disable no-underscore-dangle */
        var revertTransforms = editItemPath.__set__({
            transforms: transformsMock
        });
        /* eslint-enable no-underscore-dangle */

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(oldDirectory.files.length).to.equal(0);
        expect(_.last(newDirectory.files)).to.equal(file);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
        revertTransforms();
    });

    it('should update references to the old name for a Component file:', function () {
        var step = {
            name: 'step',
            path: '/step_definitions/step.step.js',
            ast: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'module'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'exports'
                            }
                        },
                        right: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            defaults: [],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'VariableDeclaration',
                                    declarations: [{
                                        type: 'VariableDeclarator',
                                        id: {
                                            type: 'Identifier',
                                            name: 'OldComponent'
                                        },
                                        init: {
                                            type: 'CallExpression',
                                            callee: {
                                                type: 'Identifier',
                                                name: 'require'
                                            },
                                            arguments: [{
                                                type: 'Literal',
                                                value: '../components/Old Component.component.js',
                                                raw: '\'../components/Old Component.component.js\''
                                            }]
                                        }
                                    }, {
                                        type: 'VariableDeclarator',
                                        id: {
                                            type: 'Identifier',
                                            name: 'oldComponent'
                                        },
                                        init: {
                                            type: 'NewExpression',
                                            callee: {
                                                type: 'Identifier',
                                                name: 'OldComponent'
                                            },
                                            arguments: []
                                        }
                                    }],
                                    kind: 'var'
                                }]
                            },
                            generator: false,
                            expression: false
                        }
                    }
                }],
                comments: [{
                    value: JSON.stringify({
                        name: 'step',
                        components: [{
                            name: 'Old Component'
                        }],
                        mockData: []
                    })
                }]
            }
        };
        var component = {
            name: 'oldMockData',
            path: '/components/Old Component.component.js',
            ast: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'module'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'exports'
                            }
                        },
                        right: {
                            type: 'CallExpression',
                            callee: {
                                type: 'FunctionExpression',
                                id: null,
                                params: [],
                                defaults: [],
                                body: {
                                    type: 'BlockStatement',
                                    body: [{
                                        type: 'VariableDeclaration',
                                        declarations: [{
                                            type: 'VariableDeclarator',
                                            id: {
                                                type: 'Identifier',
                                                name: 'OldComponent'
                                            },
                                            init: {
                                                type: 'FunctionExpression',
                                                id: {
                                                    type: 'Identifier',
                                                    name: 'OldComponent'
                                                },
                                                params: [],
                                                defaults: [],
                                                body: {
                                                    type: 'BlockStatement',
                                                    body: []
                                                },
                                                generator: false,
                                                expression: false
                                            }
                                        }],
                                        kind: 'var'
                                    }, {
                                        type: 'ReturnStatement',
                                        argument: {
                                            type: 'Identifier',
                                            name: 'OldComponent'
                                        }
                                    }]
                                },
                                generator: false,
                                expression: false
                            },
                            arguments: []
                        }
                    }
                }],
                comments: [{
                    value: JSON.stringify({
                        name: 'Old Component',
                        elements: [],
                        actions: []
                    })
                }]
            }
        };
        var directory = {
            files: [step, component]
        };
        var fileStructure = {
            allFiles: [step, component],
            usages: {
                '/components/Old Component.component.js': ['/step_definitions/step.step.js']
            }
        };
        var request = {
            body: {
                oldName: 'Old Component',
                newName: 'New Component',
                directoryPath: '/components'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('.component.js');
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        var findFile = sinon.stub(fileStructureUtilsMock, 'findFile');
        findFile.onCall(0).returns(component);
        findFile.onCall(1).returns(null);
        findFile.returns(step);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(component.ast.body[0].expression.right.callee.body.body[0].declarations[0].id.name).to.equal('NewComponent');
        expect(component.ast.body[0].expression.right.callee.body.body[0].declarations[0].init.id.name).to.equal('NewComponent');
        expect(component.ast.body[0].expression.right.callee.body.body[1].argument.name).to.equal('NewComponent');
        expect(JSON.parse(component.ast.comments[0].value).name).to.equal('New Component');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should update references to the old name for a Feature file:', function () {
        var os = require('os');

        var fileStructure = { };
        var feature = {
            name: 'oldFeature',
            content: 'Feature: oldFeature' + os.EOL
        };
        var directory = {
            files: [feature]
        };
        var request = {
            body: {
                oldName: 'oldFeature',
                newName: 'newFeature',
                directoryPath: '/some/path'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('.feature');
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        var findFile = sinon.stub(fileStructureUtilsMock, 'findFile');
        findFile.onCall(0).returns(feature);
        findFile.onCall(1).returns(null);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(feature.content).to.equal('Feature: newFeature' + os.EOL);

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should update references to the old name for a Mock Data file:', function () {
        var step = {
            name: 'step',
            path: '/step_definitions/step.step.js',
            ast: {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'module'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'exports'
                            }
                        },
                        right: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            defaults: [],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'VariableDeclaration',
                                    declarations: [{
                                        type: 'VariableDeclarator',
                                        id: {
                                            type: 'Identifier',
                                            name: 'oldMockData'
                                        },
                                        init: {
                                            type: 'CallExpression',
                                            callee: {
                                                type: 'Identifier',
                                                name: 'require'
                                            },
                                            arguments: [{
                                                type: 'Literal',
                                                value: '../mock_data/oldMockData.mock.json'
                                            }]
                                        }
                                    }],
                                    kind: 'var'
                                },
                                {
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'CallExpression',
                                        callee: {
                                            type: 'Identifier',
                                            name: 'oldMockData'
                                        },
                                        arguments: []
                                    }
                                }]
                            },
                            generator: false,
                            expression: false
                        }
                    }
                }],
                comments: [{
                    value: JSON.stringify({
                        name: 'step',
                        components: [],
                        mockData: [{
                            name: 'oldMockData'
                        }]
                    })
                }]
            }
        };
        var mockData = {
            name: 'oldMockData',
            path: '/mock_data/oldMockData.mock.json',
            content: '{}'
        };
        var directory = {
            files: [step, mockData]
        };
        var fileStructure = {
            allFiles: [step, mockData],
            usages: {
                '/mock_data/oldMockData.mock.json': ['/step_definitions/step.step.js']
            }
        };
        var request = {
            body: {
                oldName: 'oldMockData',
                newName: 'newMockData',
                directoryPath: '/mock_data'
            }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });
        sinon.stub(fileStructureUtilsMock, 'getExtension').returns('.mock.json');
        sinon.stub(fileStructureUtilsMock, 'findDirectory').returns(directory);
        var findFile = sinon.stub(fileStructureUtilsMock, 'findFile');
        findFile.onCall(0).returns(mockData);
        findFile.onCall(1).returns(null);
        findFile.returns(step);

        editItemPath = editItemPath();
        editItemPath(fileStructure, request);

        expect(step.ast.body[0].expression.right.body.body[0].declarations[0].init.arguments[0].value).to.equal('../mock_data/newMockData.mock.json');
        expect(step.ast.body[0].expression.right.body.body[1].expression.callee.name).to.equal('newMockData');
        expect(JSON.parse(step.ast.comments[0].value).mockData[0].name).to.equal('newMockData');

        fileStructureModiferMock.create.restore();
        fileStructureUtilsMock.getExtension.restore();
        fileStructureUtilsMock.findDirectory.restore();
        fileStructureUtilsMock.findFile.restore();
    });

    it('should throw an `UnknownOperationError` if it gets an invalid request:', function () {
        var fileStructure = {};
        var request = {
            body: { }
        };

        sinon.stub(fileStructureModiferMock, 'create', function (options) {
            return options.preSave;
        });

        expect(function () {
            editItemPath = editItemPath();
            editItemPath(fileStructure, request);
        }).to.throw('Unknown operation');

        fileStructureModiferMock.create.restore();
    });
});
