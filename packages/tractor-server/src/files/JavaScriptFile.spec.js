/* global describe:true, it:true */

// Constants:
import CONSTANTS from '../constants';

// Utilities:
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
import escodegen from 'escodegen';
import esprima from 'esprima';
import path from 'path';
import { TractorError } from 'tractor-error-handler';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import JavaScriptFile from './JavaScriptFile';

describe('server/files: JavaScriptFile:', () => {
    describe('JavaScriptFile constructor:', () => {
        it('should create a new JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new JavaScriptFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new JavaScriptFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('JavaScriptFile.read:', () => {
        it('should read the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(File.prototype.read).to.have.been.called();
            })
            .finally(() => {
                File.prototype.read.restore();
            });
        });

        it('should parse the contents', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let ast = {};

            sinon.stub(esprima, 'parse').returns(ast);
            sinon.stub(File.prototype, 'read').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(file.ast).to.equal(ast);
            })
            .finally(() => {
                esprima.parse.restore();
                File.prototype.read.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let error = new Error();
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(File.prototype, 'read').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.read()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Parsing "${path.join(path.sep, 'file-structure', 'directory', 'file.js')}" failed.`);
                expect(tractorError.status).to.equal(CONSTANTS.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.read.restore();
                console.error.restore();
            });
        });
    });

    describe('JavaScriptFile.save:', () => {
        it('should save the file to disk', () => {
            let ast = {};
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should assign the `comments` to `leadingComments`', () => {
            let ast = {
                comments: ['comment']
            };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(ast.leadingComments).to.deep.equal(['comment']);
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should generate JavaScript from the AST', () => {
            let ast = { };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(escodegen.generate).to.have.been.calledWith(ast, { comment: true });
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should rebuild any regular expressions in the AST', () => {
            let ast = {
                comments: [],
                regex: {
                    type: 'Literal',
                    raw: '/regex/'
                }
            };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.save(ast)
            .then(() => {
                expect(ast).to.deep.equal({
                    comments: [],
                    leadingComments: [],
                    regex: {
                        type: 'Literal',
                        value: /regex/,
                        raw: '/regex/'
                    }
                });
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let ast = {};
            let error = new Error();
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new JavaScriptFile(filePath, fileStructure);

            return file.save(ast)
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Saving "${path.join(path.sep, 'file-structure', 'directory', 'file.js')}" failed.`);
                expect(tractorError.status).to.equal(CONSTANTS.REQUEST_ERROR);
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
                console.error.restore();
            });
        });
    });
});
