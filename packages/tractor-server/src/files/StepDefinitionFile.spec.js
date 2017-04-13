/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import esprima from 'esprima';
import esquery from 'esquery';
import { JavaScriptFile } from './JavaScriptFile';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import { StepDefinitionFile } from './StepDefinitionFile';

describe('server/files: StepDefinitionFile:', () => {
    describe('StepDefinitionFile constructor:', () => {
        it('should create a new StepDefinitionFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new StepDefinitionFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(StepDefinitionFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new StepDefinitionFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });
    });

    describe('StepDefinitionFile.move:', () => {
        it('should move the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.step.js');
            let file = new StepDefinitionFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.step.js');
            let newFile = new StepDefinitionFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(File.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
            });
        });

        it('should update the require paths in files that reference this file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.step.js');
            let file = new StepDefinitionFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.step.js');
            let newFile = new StepDefinitionFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.step.js');

            fileStructure.references = {
                [referenceFilePath]: [filePath]
            };

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(StepDefinitionFile.prototype, 'transformRequirePaths');

            return file.move()
            .then(() => {
                expect(newFile.transformRequirePaths).to.have.been.calledWith({
                    oldFromPath: filePath,
                    newFromPath: newFilePath,
                    toPath: referenceFilePath
                });
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                StepDefinitionFile.prototype.transformRequirePaths.restore();
            });
        });
    });

    describe('StepDefinitionFile.read:', () => {
        it('should read the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(JavaScriptFile.prototype.read).to.have.been.called();
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });

        it('should update the references between files', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = {
                type: 'Program',
                body: [{
                    type: 'VariableDeclaration',
                    declarations: [{
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: 'someReference'
                        },
                        init: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'require'
                            },
                            arguments: [{
                                type: 'Literal',
                                value: './other-file',
                                raw: '\\"./other-file\\"'
                            }]
                        }
                    }],
                    kind: 'var'
                }]
            };

            return file.read()
            .then(() => {
                expect(fileStructure.references['/file-structure/directory/other-file']).to.deep.equal([filePath]);
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });

        it('should set `isPending` to true if a step definition is pending', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'callback'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'pending',
                            raw: '\'pending\''
                        }]
                    }
                }],
                sourceType: 'script'
            };

            return file.read()
            .then(() => {
                expect(file.isPending).to.equal(true);
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });

        it('should set `isPending` to false if a step definition is completed', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'callback'
                        },
                        arguments: [{
                            type: 'Literal',
                            value: 'not pending',
                            raw: '\'not pending\''
                        }]
                    }
                }],
                sourceType: 'script'
            };

            return file.read()
            .then(() => {
                expect(file.isPending).to.equal(false);
            })
            .finally(() => {
                JavaScriptFile.prototype.read.restore();
            });
        });
    });

    describe('StepDefinitionFile.save:', () => {
        it('should save the file to disk', () => {
            let ast = {
                type: 'Program',
                body: []
            };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(JavaScriptFile.prototype.save).to.have.been.called();
            })
            .finally(() => {
                JavaScriptFile.prototype.save.restore();
            });
        });

        it('should update the references between files', () => {
            let ast = {
                type: 'Program',
                body: [{
                    type: 'VariableDeclaration',
                    declarations: [{
                        type: 'VariableDeclarator',
                        id: {
                            type: 'Identifier',
                            name: 'someReference'
                        },
                        init: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'require'
                            },
                            arguments: [{
                                type: 'Literal',
                                value: '../other-directory/file',
                                raw: '\\"../other-directory/file\\"'
                            }]
                        }
                    }],
                    kind: 'var'
                }]
            };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            sinon.stub(File.prototype, 'save').returns(Promise.resolve(`var someReference = require('../other-directory/file')`));

            let file = new StepDefinitionFile(path.join(path.sep, 'file-structure', 'directory', 'file'), fileStructure);

            return file.save(ast)
            .then(() => {
                expect(fileStructure.references[path.join(path.sep, 'file-structure', 'other-directory', 'file')]).to.deep.equal([path.join(path.sep, 'file-structure', 'directory', 'file')]);
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });

        it('should remove any reference that are no longer relevant', () => {
            let ast = {
                type: 'Program',
                body: []
            };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            fileStructure.references['resolved/path'] = [filePath];

            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());

            let file = new StepDefinitionFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(fileStructure.references['resolved/path']).to.deep.equal([]);
            })
            .finally(() => {
                JavaScriptFile.prototype.save.restore();
            });
        });
    });

    describe('StepDefinitionFile.transformRequirePaths:', () => {
        it(`should update the path to another file in a file's AST`, () => {
            let ast = esprima.parse(`var reference = require('./reference.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = ast;

            file.transformRequirePaths({
                oldFromPath: '/file-structure/directory/file.js',
                newFromPath: '/file-structure/directory/new/file.js',
                toPath: '/file-structure/directory/reference.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal')
            expect(requirePath.value).to.equal('../reference.js');
        });

        it(`should update the path to a file in another file's AST`, () => {
            let ast = esprima.parse(`var reference = require('./oldName.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = ast;

            file.transformRequirePaths({
                fromPath: '/file-structure/directory/file.js',
                oldToPath: '/file-structure/directory/oldName.js',
                newToPath: '/file-structure/directory/newName.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal')
            expect(requirePath.value).to.equal('./newName.js');
        });

        it(`should update the path to a file in another file's AST when it involves going up a directory`, () => {
            let ast = esprima.parse(`var reference = require('../reference/file.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = ast;

            file.transformRequirePaths({
                fromPath: '/file-structure/directory/some/file.js',
                oldToPath: '/file-structure/directory/reference/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal')
            expect(requirePath.value).to.equal('../new/reference/file.js');
        });

        it('should work with paths from Windows', () => {
            let ast = esprima.parse(`var reference = require('./reference/file.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new StepDefinitionFile(filePath, fileStructure);
            file.ast = ast;

            let oldPathRelative = path.relative;
            sinon.stub(path, 'relative', (from, to) => {
                return oldPathRelative(from, to).replace(/\//g, '\\');
            });

            file.transformRequirePaths({
                fromPath: '/file-structure/directory/file.js',
                oldToPath: '/file-structure/directory/reference/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal')
            expect(requirePath.value).to.equal('./new/reference/file.js');

            path.relative.restore();
        });
    });
});
