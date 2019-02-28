// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import { parseScript } from 'esprima';
import * as esquery from 'esquery';
import { Identifier, Literal } from 'estree';
import * as path from 'path';
import { JavaScriptFile } from './javascript-file';

// Under test:
import { JAVASCRIPT_FILE_REFACTORER } from './javascript-file-refactorer';

describe('@tractor/file-javascript: JAVASCRIPT_FILE_REFACTORER:', () => {
    describe('JAVASCRIPT_FILE_REFACTORER.identifierChange:', () => {
        it(`should update an identifier in a file's AST`, () => {
            const ast = parseScript('var oldName');
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.identifierChange(file, {
                newName: 'newName',
                oldName: 'oldName'
            });

            const [identifier] = esquery(ast, 'Identifier') as Array<Identifier>;
            expect(identifier.name).to.equal('newName');
        });

        it(`should update an identifier in a file's AST within a specific context`, () => {
            const ast = parseScript('var oldName; function oldName () { }');
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.identifierChange(file, {
                context: 'FunctionDeclaration',
                newName: 'newName',
                oldName: 'oldName'
            });

            const [identifier1, identifier2] = esquery(ast, 'Identifier') as Array<Identifier>;
            expect(identifier1.name).to.equal('oldName');
            expect(identifier2.name).to.equal('newName');
        });
    });

    describe('JAVASCRIPT_FILE_REFACTORER.literalChange:', () => {
        it(`should update an literal in a file's AST`, () => {
            const ast = parseScript(`var value = 'old'`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.literalChange(file, {
                newValue: 'new',
                oldValue: 'old'
            });

            const [literal] = esquery(ast, 'Literal') as Array<Literal>;
            expect(literal.value).to.equal('new');
        });

        it(`should update an literal in a file's AST within a specific context`, () => {
            const ast = parseScript(`var value = 'old'; function func () { var value = 'old'; }`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.literalChange(file, {
                context: 'FunctionDeclaration > BlockStatement > VariableDeclaration > VariableDeclarator',
                newValue: 'new',
                oldValue: 'old'
            });

            const [literal1, literal2] = esquery(ast, 'Literal') as Array<Literal>;
            expect(literal1.value).to.equal('old');
            expect(literal2.value).to.equal('new');
        });
    });

    describe('JAVASCRIPT_FILE_REFACTORER.metadataChange:', () => {
        it(`should update the name of a file in it's metadata`, () => {
            const ast = parseScript('// { "name": "old name" }', { comment: true });
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.metadataChange(file, {
                newName: 'new name',
                oldName: 'old name'
            });

            const [comment] = file.ast.comments!;
            const name = JSON.parse(comment.value).name;
            expect(name).to.equal('new name');
        });

        it(`should update the name of a referenced file in another file's metadata`, () => {
            const ast = parseScript('// { "pageObjects": [{ "name": "old name" }] }', { comment: true });
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.metadataChange(file, {
                newName: 'new name',
                oldName: 'old name',
                type: 'pageObjects'
            });

            const [comment] = file.ast.comments!;
            const [pageObject] = JSON.parse(comment.value).pageObjects;
            expect(pageObject.name).to.equal('new name');
        });

        it(`should do nothing if comments aren't parsed`, () => {
            const ast = parseScript('// { "page-objects": [{ "name": "old name" }] }', { comment: true });
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            expect(() => {
                JAVASCRIPT_FILE_REFACTORER.metadataChange(file, {});
            }).to.not.throw();
        });

        it(`should do nothing if there are no comments`, () => {
            const ast = parseScript('var foo', { comment: true });
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file.js');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            expect(() => {
                JAVASCRIPT_FILE_REFACTORER.metadataChange(file, {});
            }).to.not.throw();
        });
    });

    describe('JAVASCRIPT_FILE_REFACTORER.referencePathChange:', () => {
        it(`should update the path to another file in a file's AST`, () => {
            const ast = parseScript(`var reference = require('./reference.js')`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.referencePathChange(file, {
                newFromPath: '/file-structure/directory/new/file.js',
                oldFromPath: '/file-structure/directory/file.js',
                toPath: '/file-structure/directory/reference.js'
            });

            const [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal') as Array<Literal>;
            expect(requirePath.value).to.equal('../reference.js');
        });

        it(`should update the path to a file in another file's AST`, () => {
            const ast = parseScript(`var reference = require('./oldName.js')`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.referencePathChange(file, {
                fromPath: '/file-structure/directory/file.js',
                newToPath: '/file-structure/directory/newName.js',
                oldToPath: '/file-structure/directory/oldName.js'
            });

            const [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal') as Array<Literal>;
            expect(requirePath.value).to.equal('./newName.js');
        });

        it(`should update the path to a file in another file's AST when it involves going up a directory`, () => {
            const ast = parseScript(`var reference = require('../reference/file.js')`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.referencePathChange(file, {
                fromPath: '/file-structure/directory/some/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js',
                oldToPath: '/file-structure/directory/reference/file.js'
            });

            const [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal') as Array<Literal>;
            expect(requirePath.value).to.equal('../new/reference/file.js');
        });

        it('should work with paths from Windows', () => {
            const ast = parseScript(`var reference = require('./reference/file.js')`);
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            const oldPathRelative = path.relative;
            const relative = jest.spyOn(path, 'relative').mockImplementation((from, to) => oldPathRelative(from, to).replace(/\//g, '\\'));

            JAVASCRIPT_FILE_REFACTORER.referencePathChange(file, {
                fromPath: '/file-structure/directory/file.js',
                newToPath: '/file-structure/directory/new/reference/file.js',
                oldToPath: '/file-structure/directory/reference/file.js'
            });

            const [requirePath] = esquery(ast, 'CallExpression[callee.name="require"] Literal') as Array<Literal>;
            expect(requirePath.value).to.equal('./new/reference/file.js');
            relative.mockRestore();
        });
    });

    describe('JAVASCRIPT_FILE_REFACTORER.versionChange:', () => {
        it(`should update the version in a file's metadata`, () => {
            const ast = parseScript(`/* {"version":"0.1.0"} */`, { comment: true });
            const fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            const filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            JAVASCRIPT_FILE_REFACTORER.versionChange(file, {
                version: '0.2.0'
            });

            const [metaData] = file.ast.comments!;
            expect(metaData.value).to.equal('{"version":"0.2.0"}');
        });
    });
});
