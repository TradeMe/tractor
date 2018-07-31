// Test setup:
import { expect, sinon } from '@tractor/unit-test';
import dedent from 'dedent';

// Utilities:
import escodegen from 'escodegen';
import * as esprima from 'esprima';
import path from 'path';

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import { MochaSpecFile } from './mocha-spec-file';

// Under test:
import { MochaSpecFileRefactorer } from './mocha-spec-file-refactorer';

describe('@tractor-plugins/mocha-spec: mocha-spec-file-refactorer:', () => {
    describe('MochaSpecFileRefactorer.referenceNameChange', () => {
        it('should update the name of the file in a mocha spec', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new MochaSpecFile(path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js'), fileStructure);

            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            file.ast = esprima.parse(`
                /*{"name":"Foo","tests":[],"version":"0.1.0"}*/
                describe('Foo', function () {
                });
            `, {
                comment: true
            });

            await MochaSpecFileRefactorer.fileNameChange(file, {
                oldName: 'Foo',
                newName: 'Bar',
                extension: '.mock.json'
            });

            file.ast.leadingComments = file.ast.comments;
            let mochaSpec = escodegen.generate(file.ast, {
                comment: true
            });

            expect(mochaSpec).to.equal(dedent(`
                /*{"name":"Bar","tests":[],"version":"0.1.0"}*/
                describe('Bar', function () {
                });
            `));

            MochaSpecFile.prototype.save.restore();
        });
    });

    describe('MochaSpecFileRefactorer.referenceNameChange', () => {
        it('should update the name of a mock request file in a mocha spec', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new MochaSpecFile(path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js'), fileStructure);

            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            file.ast = esprima.parse(`
                /*{"name":"Mocha Spec file","tests":[{"name":"Test"}],"version":"0.1.0"}*/
                describe('Mocha Spec file', function () {
                    it('Test', function () {
                        var foo = require('../mock-requests/foo.mock.json');
                        var step = Promise.resolve();
                        step = step.then(function () {
                            return mockRequests.whenGET(/foo/, {
                                body: foo,
                                status: 200
                            });
                        });
                        return step;
                    });
                });
            `, {
                comment: true
            });

            await MochaSpecFileRefactorer.referenceNameChange(file, {
                oldName: 'foo',
                newName: 'bar',
                extension: '.mock.json'
            });

            file.ast.leadingComments = file.ast.comments;
            let mochaSpec = escodegen.generate(file.ast, {
                comment: true
            });

            expect(mochaSpec).to.equal(dedent(`
                /*{"name":"Mocha Spec file","tests":[{"name":"Test"}],"version":"0.1.0"}*/
                describe('Mocha Spec file', function () {
                    it('Test', function () {
                        var bar = require('../mock-requests/foo.mock.json');
                        var step = Promise.resolve();
                        step = step.then(function () {
                            return mockRequests.whenGET(/foo/, {
                                body: bar,
                                status: 200
                            });
                        });
                        return step;
                    });
                });
            `));

            MochaSpecFile.prototype.save.restore();
        });

        it('should update the name of a page object file in a mocha spec', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new MochaSpecFile(path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js'), fileStructure);

            sinon.stub(MochaSpecFile.prototype, 'save').resolves();

            file.ast = esprima.parse(`
                /*{"name":"Mocha Spec file","tests":[{"name":"Test"}],"version":"0.1.0"}*/
                describe('Mocha Spec file', function () {
                    it('Test', function () {
                        var Foo = require('../page-objects/foo.po.js'), foo = new Foo();
                        var step = Promise.resolve();
                        step = step.then(function () {
                            return foo.bop();
                        });
                        return step;
                    });
                });
            `, {
                comment: true
            });

            await MochaSpecFileRefactorer.referenceNameChange(file, {
                oldName: 'foo',
                newName: 'bar',
                extension: '.po.js'
            });

            file.ast.leadingComments = file.ast.comments;
            let stepDefinition = escodegen.generate(file.ast, {
                comment: true
            });

            expect(stepDefinition).to.equal(dedent(`
                /*{"name":"Mocha Spec file","tests":[{"name":"Test"}],"version":"0.1.0"}*/
                describe('Mocha Spec file', function () {
                    it('Test', function () {
                        var Bar = require('../page-objects/foo.po.js'), bar = new Bar();
                        var step = Promise.resolve();
                        step = step.then(function () {
                            return bar.bop();
                        });
                        return step;
                    });
                });
            `));

            MochaSpecFile.prototype.save.restore();
        });

        it('should do nothing if the file extension is not valid', async () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new MochaSpecFile(path.join(path.sep, 'file-structure', 'directory', 'file.e2e-spec.js'), fileStructure);

            sinon.stub(MochaSpecFile.prototype, 'refactor');

            await MochaSpecFileRefactorer.referenceNameChange(file, {
                oldName: 'foo',
                newName: 'bar',
                extension: '.js'
            });

            expect(MochaSpecFile.prototype.refactor).to.not.have.been.called();

            MochaSpecFile.prototype.refactor.restore();
        });
    });
});
