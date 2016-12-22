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
import FeatureLexerFormatter from './utils/FeatureLexerFormatter';
import gherkin from 'gherkin';
import path from 'path';
import StepDefinitionGenerator from './utils/StepDefinitionGenerator';
import { TractorError } from 'tractor-error-handler';
import { File, FileStructure } from 'tractor-file-structure';

// Under test:
import FeatureFile from './FeatureFile';

describe('server/files: FeatureFile:', () => {
    describe('FeatureFile constructor:', () => {
        it('should create a new FeatureFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new FeatureFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(FeatureFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new FeatureFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('FeatureFile.read:', () => {
        it('should read the file from disk', () => {
            class Lexer {
                scan () {}
            }

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(Lexer);

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(File.prototype.read).to.have.been.called();
            })
            .finally(() => {
                File.prototype.read.restore();
                gherkin.Lexer.restore();
            });
        });

        it('should lex the contents', () => {
            class Lexer {
                scan () {}
            }

            let features = ['feature1', 'feature2'];
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(FeatureLexerFormatter.prototype, 'done').returns(features);
            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(Lexer);
            sinon.stub(Lexer.prototype, 'scan');

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(file.tokens).to.deep.equal(['feature1', 'feature2']);
                expect(Lexer.prototype.scan).to.have.been.called();
            })
            .finally(() => {
                FeatureLexerFormatter.prototype.done.restore();
                File.prototype.read.restore();
                gherkin.Lexer.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let error = new Error();
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'read').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Lexing "${path.join(path.sep, 'file-structure', 'directory', 'file.feature')}" failed.`);
                expect(tractorError.status).to.equal(CONSTANTS.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.read.restore();
                console.error.restore();
            });
        });
    });

    describe('FeatureFile.save:', () => {
        it('should save the file to disk', () => {
            class Lexer {
                scan () {}
            }

            let content = '';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(Lexer);
            sinon.stub(Lexer.prototype, 'scan');
            sinon.stub(StepDefinitionGenerator.prototype, 'generate').returns(Promise.resolve());

            let file = new FeatureFile(filePath, fileStructure);

            return file.save(content)
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
                gherkin.Lexer.restore();
                StepDefinitionGenerator.prototype.generate.restore();
            });
        });

        it('should generate step definitions for the file', () => {
            class Lexer {
                scan () {}
            }

            let content = '';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(Lexer);
            sinon.stub(Lexer.prototype, 'scan');
            sinon.stub(StepDefinitionGenerator.prototype, 'generate').returns(Promise.resolve());

            let file = new FeatureFile(filePath, fileStructure);

            return file.save(content)
            .then(() => {
                expect(StepDefinitionGenerator.prototype.generate).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
                gherkin.Lexer.restore();
                StepDefinitionGenerator.prototype.generate.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let content = '';
            let error = new Error();
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new FeatureFile(filePath, fileStructure);

            return file.save(content)
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Generating step definitions from "${path.join(path.sep, 'file-structure', 'directory', 'file.feature')}" failed.`);
                expect(tractorError.status).to.equal(CONSTANTS.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.save.restore();
                console.error.restore();
            });
        });
    });
});
