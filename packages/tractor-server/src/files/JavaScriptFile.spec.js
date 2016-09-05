/* global describe:true, it:true */

// Constants:
import constants from '../constants';

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
import escodegen from 'escodegen';
import esprima from 'esprima';
import File from './File';
import path from 'path';
import { TractorError } from 'tractor-error-handler';

// Under test:
import JavaScriptFile from './JavaScriptFile';

describe('server/files: JavaScriptFile:', () => {
    describe('JavaScriptFile constructor:', () => {
        it('should create a new JavaScriptFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            let file = new JavaScriptFile(filePath, directory);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should inherit from File', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            let file = new JavaScriptFile(filePath, directory);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('JavaScriptFile.read:', () => {
        it('should read the file from disk', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

            return file.read()
            .then(() => {
                expect(File.prototype.read).to.have.been.called();
            })
            .finally(() => {
                File.prototype.read.restore();
            });
        });

        it('should parse the contents', () => {
            let ast = {};
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            sinon.stub(esprima, 'parse').returns(ast);
            sinon.stub(File.prototype, 'read').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

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
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(File.prototype, 'read').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new JavaScriptFile(filePath, directory);

            return file.read()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Parsing "${path.join('some', 'javascript', 'file.js')}" failed.`);
                expect(tractorError.status).to.equal(constants.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.read.restore();
                console.error.restore();
            });
        });
    });

    describe('JavaScriptFile.save:', () => {
        it('should save the file to disk', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

            return file.save()
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });

        it('should assign the `comments` to `leadingComments`', () => {
            let data = {
                comments: ['comment']
            };
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

            return file.save(data)
            .then(() => {
                expect(file.ast.leadingComments).to.deep.equal(['comment']);
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should generate JavaScript from the AST', () => {
            let data = { };
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

            return file.save(data)
            .then(() => {
                expect(escodegen.generate).to.have.been.calledWith(data, { comment: true });
            })
            .finally(() => {
                escodegen.generate.restore();
                File.prototype.save.restore();
            });
        });

        it('should rebuild any regular expressions in the AST', () => {
            let data = {
                comments: [],
                regex: {
                    type: 'Literal',
                    raw: '/regex/'
                }
            };
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(escodegen, 'generate');
            sinon.stub(File.prototype, 'save').returns(Promise.resolve());

            let file = new JavaScriptFile(filePath, directory);

            return file.save(data)
            .then(() => {
                expect(file.ast).to.deep.equal({
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
            let error = new Error();
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'javascript', 'file.js');

            sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new JavaScriptFile(filePath, directory);

            return file.save()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Saving "${path.join('some', 'javascript', 'file.js')}" failed.`);
                expect(tractorError.status).to.equal(constants.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.save.restore();
                console.error.restore();
            });
        });
    });
});
