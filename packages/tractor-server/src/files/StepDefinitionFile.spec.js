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
import JavaScriptFile from './JavaScriptFile';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import StepDefinitionFile from './StepDefinitionFile';

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
            // let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            // let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            //
            // sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());
            // sinon.stub(path, 'resolve').returns('resolved/path');
            //
            // let file = new StepDefinitionFile(filePath, fileStructure);
            // file.ast = {
            //     type: 'Program',
            //     body: [{
            //         type: 'VariableDeclaration',
            //         declarations: [{
            //             type: 'VariableDeclarator',
            //             id: {
            //                 type: 'Identifier',
            //                 name: 'someReference'
            //             },
            //             init: {
            //                 type: 'CallExpression',
            //                 callee: {
            //                     type: 'Identifier',
            //                     name: 'require'
            //                 },
            //                 arguments: [{
            //                     type: 'Literal',
            //                     value: './path/to/reference',
            //                     raw: '\\"./path/to/reference\\"'
            //                 }]
            //             }
            //         }],
            //         kind: 'var'
            //     }]
            // };
            //
            // return file.read()
            // .then(() => {
            //     expect(fileStructure.references['resolved/path']).to.deep.equal([path.join(path.sep, 'file-structure', 'directory', 'file')]);
            // })
            // .finally(() => {
            //     JavaScriptFile.prototype.read.restore();
            //     path.resolve.restore();
            // });
        });

        it('should remove any reference that are no longer relevant', () => {
            // let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            // let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            // fileStructure.references['resolved/path'] = [filePath];
            //
            // sinon.stub(JavaScriptFile.prototype, 'read').returns(Promise.resolve());
            //
            // let file = new StepDefinitionFile(filePath, fileStructure);
            // file.ast = {
            //     type: 'Program',
            //     body: []
            // };
            //
            // return file.read()
            // .then(() => {
            //     expect(fileStructure.references['resolved/path']).to.deep.equal([]);
            // })
            // .finally(() => {
            //     JavaScriptFile.prototype.read.restore();
            // });
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
});
