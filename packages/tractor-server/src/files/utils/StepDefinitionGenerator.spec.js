/* global describe:true, it:true */

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
import { FeatureFile } from '../FeatureFile';
import { StepDefinitionFile } from '../StepDefinitionFile';
import { Directory, FileStructure } from 'tractor-file-structure';

// Under test:
import { StepDefinitionGenerator } from './StepDefinitionGenerator';

describe('server/utils: StepDefinitionGenerator:', () => {
    describe('StepDefinitionGenerator.generate:', () => {
        it('should generate files for each step in a feature', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
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
            `);
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
            sinon.spy(stepDefinitionsDirectory, 'addItem');

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
                    let call = stepDefinitionsDirectory.addItem.getCall(index);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given _
            `);
            let result = `
                this.Given(/^_$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test'
                As a test
                I want to test
                Scenario: Test
                  Given /\\\\
            `);
            let result = `
                this.Given(/^\\\/\\\\$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given <>
            `);
            let result = `
                this.Given(/^<>$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given ?:*"|
            `);
            let result = `
                this.Given(/^\\?\\:\\*\\"\\|$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
                .then(() => {
                    let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  When $100
            `);
            let result = `
                this.When(/^\\$\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .finally(() => {
                let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let stepDefinitionsDirectory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  When 100
            `);
            let result = `
                this.When(/^\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsDirectory, 'addItem');

            let stepDefinitionGenerator = new StepDefinitionGenerator(file);
            return stepDefinitionGenerator.generate()
            .then(() => {
                let addFileCall = stepDefinitionsDirectory.addItem.getCall(0);
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
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let existingFile = new StepDefinitionFile(path.join(path.sep, 'file-structure', 'step-definitions', 'Given something.step.js'), fileStructure);
            let file = new FeatureFile(path.join(path.sep, 'file-structure', 'features', 'feature.feature'), fileStructure);
            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given something
            `);
            let result = `
                this.Given(/^something$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

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
                StepDefinitionFile.prototype.save.restore();
            });
        });
    });
});
