/* global describe:true, it:true */

// Utilities:
import _ from 'lodash';
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

// Under test:
import StepDefinitionGenerator from './StepDefinitionGenerator';

describe('server/utils: StepDefinitionGenerator:', () => {
    describe('StepDefinitionGenerator.generate:', () => {
        // it('should generate files for each step in a feature', () => {
        //     let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        //     let directory = new Directory(path.join(path.sep, 'file-structure', 'step-definitions'), fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given something
        //               And something else
        //               When something happens
        //               Then something else happens
        //               But something else does not happen
        //         `),
        //         path: ''
        //     };
        //     let result = dedent(`
        //         this.Given(/^something$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //
        //         this.Given(/^something else$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //
        //         this.When(/^something happens$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //
        //         this.Then(/^something else happens$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions'
        //             callback.pending();
        //         });
        //
        //         this.Then(/^something else does not happen$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         let expectations = [
        //             'Given something',
        //             'Given something else',
        //             'When something happens',
        //             'Then something else happens',
        //             'Then something else does not happen'
        //         ];
        //
        //         _.each(expectations, (expectation, index) => {
        //             let call = directory.addFile.getCall(index);
        //             let [file] = call.args;
        //
        //             expect(file.name).to.equal(expectation);
        //         });
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });

        // it('should escape underscore', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given _
        //         `)
        //     };
        //     let result = dedent(`
        //         this.Given(/^_$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         let addFileCall = directory.addFile.getCall(0);
        //         let [file] = addFileCall.args;
        //         let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //         let [ast] = saveCall.args;
        //         let [comment] = ast.comments;
        //         let meta = comment.value;
        //
        //         expect(file.name).to.equal('Given __');
        //         expect(JSON.parse(meta).name).to.equal('Given _');
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
        //
        // it('should escape slashes', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test'
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given /\\\\
        //         `)
        //     };
        //     let result = dedent(`
        //         this.Given(/^\\\/\\\\$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         let addFileCall = directory.addFile.getCall(0);
        //         let [file] = addFileCall.args;
        //         let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //         let [ast] = saveCall.args;
        //         let [comment] = ast.comments;
        //         let meta = comment.value;
        //
        //         expect(file.name).to.equal('Given __');
        //         expect(JSON.parse(meta).name).to.equal('Given /\\');
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
        //
        // it('should escape brackets', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given <>
        //         `)
        //     };
        //     let result = dedent(`
        //         this.Given(/^<>$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         let addFileCall = directory.addFile.getCall(0);
        //         let [file] = addFileCall.args;
        //         let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //         let [ast] = saveCall.args;
        //         let [comment] = ast.comments;
        //         let meta = comment.value;
        //
        //         expect(file.name).to.equal('Given __');
        //         expect(JSON.parse(meta).name).to.equal('Given <>');
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
        //
        // it('should escape special characters', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given ?:*"|
        //         `)
        //     };
        //     let result = dedent(`
        //         this.Given(/^\\?\\:\\*\\"\\|$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //         .then(() => {
        //             let addFileCall = directory.addFile.getCall(0);
        //             let [file] = addFileCall.args;
        //             let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //             let [ast] = saveCall.args;
        //             let [comment] = ast.comments;
        //             let meta = comment.value;
        //
        //             expect(file.name).to.equal('Given _____');
        //             expect(JSON.parse(meta).name).to.equal('Given ?:*"|');
        //         })
        //         .finally(() => {
        //             childProcess.execAsync.restore();
        //             fileStructure.structure.getDirectory.restore();
        //             StepDefinitionFile.prototype.save.restore();
        //         });
        // });
        //
        // it('should escape money amounts:', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               When $100
        //         `)
        //     };
        //     let result = dedent(`
        //         this.When(/^\\$\\d+$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .finally(() => {
        //         let addFileCall = directory.addFile.getCall(0);
        //         let [file] = addFileCall.args;
        //         let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //         let [ast] = saveCall.args;
        //         let [comment] = ast.comments;
        //         let meta = comment.value;
        //
        //         expect(file.name).to.equal('When $amount');
        //         expect(JSON.parse(meta).name).to.equal('When $100');
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
        //
        // it('should escape number amounts:', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               When 100
        //         `)
        //     };
        //     let result = dedent(`
        //         this.When(/^\\d+$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(directory, 'addFile');
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         let addFileCall = directory.addFile.getCall(0);
        //         let [file] = addFileCall.args;
        //         let saveCall = StepDefinitionFile.prototype.save.getCall(0);
        //         let [ast] = saveCall.args;
        //         let [comment] = ast.comments;
        //         let meta = comment.value;
        //
        //         expect(file.name).to.equal('When $number');
        //         expect(JSON.parse(meta).name).to.equal('When 100');
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
        //
        // it('should not overwrite existing files:', () => {
        //     let directory = new Directory('directory', fileStructure);
        //     let existingFile = {
        //         name: 'Given something',
        //         path: '/file-structure/directory/Given something.step.js'
        //     };
        //     let file = {
        //         content: dedent(`
        //             Feature: Test
        //             In order to test
        //             As a test
        //             I want to test
        //             Scenario: Test
        //               Given something
        //         `)
        //     };
        //     let result = dedent(`
        //         this.Given(/^something$/, function (callback) {
        //             // Write code here that turns the phrase above into concrete actions
        //             callback.pending();
        //         });
        //     `);
        //
        //     let oldAllFiles = fileStructure.allFiles;
        //     fileStructure.allFiles = [existingFile];
        //     sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
        //     sinon.stub(fileStructure.structure, 'getDirectory').returns(directory);
        //     sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
        //
        //     let stepDefinitionGenerator = new StepDefinitionGenerator(file);
        //     return stepDefinitionGenerator.generate()
        //     .then(() => {
        //         expect(StepDefinitionFile.prototype.save).to.not.have.been.called();
        //     })
        //     .finally(() => {
        //         childProcess.execAsync.restore();
        //         fileStructure.allFiles = oldAllFiles;
        //         fileStructure.structure.getDirectory.restore();
        //         StepDefinitionFile.prototype.save.restore();
        //     });
        // });
    });
});
