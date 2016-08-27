/* global describe:true, it:true */
'use strict';

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
import FeatureLexerFormatter from './utils/FeatureLexerFormatter';
import File from './File';
import gherkin from 'gherkin';
import os from 'os';
import path from 'path';
import StepDefinitionGenerator from './utils/StepDefinitionGenerator';
import TractorError from '../errors/TractorError';

// Under test:
import FeatureFile from './FeatureFile';

describe('server/files: FeatureFile:', () => {
    describe('FeatureFile constructor:', () => {
        it('should create a new FeatureFile', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            let file = new FeatureFile(filePath, directory);

            expect(file).to.be.an.instanceof(FeatureFile);
        });

        it('should inherit from File', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            let file = new FeatureFile(filePath, directory);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('FeatureFile.read:', () => {
        it('should read the file from disk', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');
            let scan = _.noop;
            let lexerConstructor = function Lexer () {
                this.scan = scan;
            };

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(lexerConstructor);

            let file = new FeatureFile(filePath, directory);

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
            let features = ['feature1', 'feature2'];
            let lexer = function Lexer () { };
            lexer.prototype.scan = _.noop;
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'path');

            sinon.stub(FeatureLexerFormatter.prototype, 'done').returns(features);
            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(gherkin, 'Lexer').returns(lexer);
            sinon.stub(lexer.prototype, 'scan');

            let file = new FeatureFile(filePath, directory);

            return file.read()
            .then(() => {
                expect(file.tokens).to.deep.equal(['feature1', 'feature2']);
                expect(lexer.prototype.scan).to.have.been.called();
            })
            .finally(() => {
                FeatureLexerFormatter.prototype.done.restore();
                File.prototype.read.restore();
                gherkin.Lexer.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let error = new Error();
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'feature', 'file.feature');

            sinon.stub(File.prototype, 'read').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new FeatureFile(filePath, directory);

            return file.read()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Lexing "${path.join('some', 'feature', 'file.feature')}" failed.`);
                expect(tractorError.status).to.equal(constants.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.read.restore();
                console.error.restore();
            });
        });
    });

    describe('FeatureFile.save:', () => {
        it('should save the file to disk', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'feature', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(StepDefinitionGenerator.prototype, 'generate').returns(Promise.resolve());

            let file = new FeatureFile(filePath, directory);

            return file.save()
            .then(() => {
                expect(File.prototype.save).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
                StepDefinitionGenerator.prototype.generate.restore();
            });
        });

        it('should generate step definitions for the file', () => {
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'feature', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(StepDefinitionGenerator.prototype, 'generate').returns(Promise.resolve());

            let file = new FeatureFile(filePath, directory);

            return file.save()
            .then(() => {
                expect(StepDefinitionGenerator.prototype.generate).to.have.been.called();
            })
            .finally(() => {
                File.prototype.save.restore();
                StepDefinitionGenerator.prototype.generate.restore();
            });
        });

        it('should replace any newline characters in the content to be saved', () => {
            let data = 'some\ncontent\nwith\nnewlines';
            let dataWithNewlines = `some${os.EOL}content${os.EOL}with${os.EOL}newlines`;
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'feature', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.resolve());
            sinon.stub(StepDefinitionGenerator.prototype, 'generate').returns(Promise.resolve());

            let file = new FeatureFile(filePath, directory);

            return file.save(data)
            .then(() => {
                expect(file.content).to.equal(dataWithNewlines);
            })
            .finally(() => {
                File.prototype.save.restore();
                StepDefinitionGenerator.prototype.generate.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let error = new Error();
            let directory = {
                addFile: _.noop
            };
            let filePath = path.join('some', 'feature', 'file.feature');

            sinon.stub(File.prototype, 'save').returns(Promise.reject(error));
            sinon.stub(console, 'error');

            let file = new FeatureFile(filePath, directory);

            return file.save()
            .catch((tractorError) => {
                expect(console.error).to.have.been.calledWith(error);

                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Generating step definitions from "${path.join('some', 'feature', 'file.feature')}" failed.`);
                expect(tractorError.status).to.equal(constants.REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.save.restore();
                console.error.restore();
            });
        });
    });
});
