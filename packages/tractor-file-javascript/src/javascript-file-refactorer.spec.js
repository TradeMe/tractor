// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import * as esprima from 'esprima';
import esquery from 'esquery';
import path from 'path';
import { FileStructure } from '@tractor/file-structure';
import { JavaScriptFile } from './javascript-file';

// Under test:
import { JavaScriptFileRefactorer } from './javascript-file-refactorer';

describe('@tractor/file-javascript: JavaScriptFileRefactorer:', () => {
    describe('JavaScriptFileRefactorer.identifierChange:', () => {
        it(`should update an identifier in a file's AST`, () => {
            let ast = esprima.parseScript('var oldName');

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.identifierChange(file, {
                oldName: 'oldName',
                newName: 'newName'
            });

            let [identifier] = esquery(ast, 'Identifier');

            expect(identifier.name).to.equal('newName');
        });

        it(`should update an identifier in a file's AST within a specific context`, () => {
            let ast = esprima.parseScript('var oldName; function oldName () { }');
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.identifierChange(file, {
                oldName: 'oldName',
                newName: 'newName',
                context: 'FunctionDeclaration'
            });

            let [identifier1, identifier2] = esquery(ast, 'Identifier');

            expect(identifier1.name).to.equal('oldName');
            expect(identifier2.name).to.equal('newName');
        });
    });

    describe('JavaScriptFileRefactorer.literalChange:', () => {
        it(`should update an literal in a file's AST`, () => {
            let ast = esprima.parseScript(`var value = 'old'`);

            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.literalChange(file, {
                oldValue: 'old',
                newValue: 'new'
            });

            let [literal] = esquery(ast, 'Literal');

            expect(literal.value).to.equal('new');
        });

        it(`should update an literal in a file's AST within a specific context`, () => {
            let ast = esprima.parseScript(`var value = 'old'; function func () { var value = 'old'; }`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.literalChange(file, {
                oldValue: 'old',
                newValue: 'new',
                context: 'FunctionDeclaration > BlockStatement > VariableDeclaration > VariableDeclarator'
            });

            let [literal1, literal2] = esquery(ast, 'Literal');

            expect(literal1.value).to.equal('old');
            expect(literal2.value).to.equal('new');
        });
    });

    describe('JavaScriptFileRefactorer.metadataChange:', () => {
        it(`should update the name of a file in it's metadata`, () => {
            let ast = esprima.parseScript('// { "name": "old name" }', { comment: true });
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.metadataChange(file, {
                oldName: 'old name',
                newName: 'new name'
            });

            let [comment] = file.ast.comments;
            let name = JSON.parse(comment.value).name;

            expect(name).to.equal('new name');
        });

        it(`should update the name of a referenced file in another file's metadata`, () => {
            let ast = esprima.parseScript('// { "pageObjects": [{ "name": "old name" }] }', { comment: true });
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.metadataChange(file, {
                oldName: 'old name',
                newName: 'new name',
                type: 'pageObjects'
            });

            let [comment] = file.ast.comments;
            let [pageObject] = JSON.parse(comment.value)['pageObjects'];

            expect(pageObject.name).to.equal('new name');
        });

        it(`should do nothing if comments aren't parsed`, () => {
            let ast = esprima.parseScript('// { "page-objects": [{ "name": "old name" }] }');
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            expect(() => {
                JavaScriptFileRefactorer.metadataChange(file, {});
            }).to.not.throw();
        });

        it(`should do nothing if there are no comments`, () => {
            let ast = esprima.parseScript('var foo', { comment: true });
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');

            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            expect(() => {
                JavaScriptFileRefactorer.metadataChange(file, {});
            }).to.not.throw();
        });
    });

    describe('JavaScriptFileRefactorer.referencePathChange:', () => {
        it(`should update the path to another file in a file's AST`, () => {
            let ast = esprima.parse(`var reference = require('./reference.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.referencePathChange(file, {
                oldFromPath: '/file-structure/directory/file.js',
                newFromPath: '/file-structure/directory/new/file.js',
                toPath: '/file-structure/directory/reference.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal');
            expect(requirePath.value).to.equal('../reference.js');
        });

        it(`should update the path to a file in another file's AST`, () => {
            let ast = esprima.parse(`var reference = require('./oldName.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.referencePathChange(file, {
                fromPath: '/file-structure/directory/file.js',
                oldToPath: '/file-structure/directory/oldName.js',
                newToPath: '/file-structure/directory/newName.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal');
            expect(requirePath.value).to.equal('./newName.js');
        });

        it(`should update the path to a file in another file's AST when it involves going up a directory`, () => {
            let ast = esprima.parse(`var reference = require('../reference/file.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.referencePathChange(file, {
                fromPath: '/file-structure/directory/some/file.js',
                oldToPath: '/file-structure/directory/reference/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal');
            expect(requirePath.value).to.equal('../new/reference/file.js');
        });

        it('should work with paths from Windows', () => {
            let ast = esprima.parse(`var reference = require('./reference/file.js')`);
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            let oldPathRelative = path.relative;
            sinon.stub(path, 'relative').callsFake((from, to) => {
                return oldPathRelative(from, to).replace(/\//g, '\\');
            });

            JavaScriptFileRefactorer.referencePathChange(file, {
                fromPath: '/file-structure/directory/file.js',
                oldToPath: '/file-structure/directory/reference/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js'
            });

            let [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal');
            expect(requirePath.value).to.equal('./new/reference/file.js');

            path.relative.restore();
        });
    });

    describe('JavaScriptFileRefactorer.versionChange:', () => {
        it(`should update the version in a file's metadata`, () => {
            let ast = esprima.parse(`/* {"version":"0.1.0"} */`, { comment: true });
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            let file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JavaScriptFileRefactorer.versionChange(file, {
                version: '0.2.0'
            });

            const [metaData] = file.ast.comments;
            expect(metaData.value).to.equal('{"version":"0.2.0"}');
        });
    });
});
