/* global afterEach: true, beforeEach: true, describe:true, it:true */

// Utilities:
import chai from 'chai';
import dedent from 'dedent';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import childProcess from 'child_process';
import StepDefinitionFile from '../StepDefinitionFile';
import { Directory, FileStructure } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';

// Under test:
import StepDefinitionGenerator from './StepDefinitionGenerator';

describe('server/utils: StepDefinitionGenerator:', () => {
    describe('StepDefinitionGenerator.generate:', () => {
        let oldFileStructure;
        let fileStructure;

        beforeEach(() => {
            fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            tractorFileStructure.fileStructure = fileStructure;
        });

        afterEach(() => {
            tractorFileStructure.fileStructure = oldFileStructure;
        });

        it('should generate files for each step in a feature', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      Given something
                      And something else
                      When something happens
                      Then something else happens
                      But something else does not happen
                `),
                path: ''
            };
            let result = `
                this.Given(/^something$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.Given(/^something else$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.When(/^something happens$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.Then(/^something else happens$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions'
                    callback(null, 'pending');
                });

                this.Then(/^something else does not happen$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let expectations = [
                    'Given something',
                    'Given something else',
                    'When something happens',
                    'Then something else happens',
                    'Then something else does not happen'
                ];

                expectations.forEach((expectation, index) => {
                    let call = directory.addItem.getCall(index);
                    let [file] = call.args;

                    expect(file.basename).to.equal(expectation);
                });
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should escape underscore', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      Given _
                `)
            };
            let result = `
                this.Given(/^_$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = directory.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given _');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should escape slashes', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test'
                    As a test
                    I want to test
                    Scenario: Test
                      Given /\\\\
                `)
            };
            let result = `
                this.Given(/^\\\/\\\\$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = directory.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given /\\');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should escape brackets', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      Given <>
                `)
            };
            let result = `
                this.Given(/^<>$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = directory.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given <>');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should escape special characters', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      Given ?:*"|
                `)
            };
            let result = `
                this.Given(/^\\?\\:\\*\\"\\|$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
                .then(() => {
                    let addFileCall = directory.addItem.getCall(0);
                    let [file] = addFileCall.args;
                    let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                    let [ast] = saveCall.args;
                    let [comment] = ast.comments;
                    let meta = comment.value;

                    expect(file.basename).to.equal('Given _____');
                    expect(JSON.parse(meta).name).to.equal('Given ?:*"|');
                })
                .finally(() => {
                    childProcess.execAsync.restore();
                    StepDefinitionFile.prototype.save.restore();
                });
        });

        it('should escape money amounts:', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      When $100
                `)
            };
            let result = `
                this.When(/^\\$\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .finally(() => {
                let addFileCall = directory.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('When $amount');
                expect(JSON.parse(meta).name).to.equal('When $100');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should escape number amounts:', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      When 100
                `),
                parent: directory
            };
            let result = `
                this.When(/^\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(directory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = directory.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('When $number');
                expect(JSON.parse(meta).name).to.equal('When 100');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });

        it('should not overwrite existing files:', () => {
            let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let existingFile = {
                basename: 'Given something',
                path: '/file-structure/step-definitions/Given something.step.js'
            };
            let file = {
                content: dedent(`
                    Feature: Test
                    In order to test
                    As a test
                    I want to test
                    Scenario: Test
                      Given something
                `),
                parent: directory
            };
            let result = `
                this.Given(/^something$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            let oldAllFiles = fileStructure.structure.allFiles;
            fileStructure.structure.allFiles = [existingFile];
            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                expect(StepDefinitionFile.prototype.save).to.not.have.been.called();
            })
            .finally(() => {
                childProcess.execAsync.restore();
                fileStructure.structure.allFiles = oldAllFiles;
                StepDefinitionFile.prototype.save.restore();
            });
        });
    });
});
