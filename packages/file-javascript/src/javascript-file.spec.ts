// Constants:
const REQUEST_ERROR = 400;

// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { File, FileStructure } from '@tractor/file-structure';
import { parseScript } from 'esprima';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { promisify } from 'util';
import { JavaScriptFileMetaItem } from './javascript-file-metadata';

// Under test:
import { JavaScriptFile } from './javascript-file';

describe('@tractor/file-javascript: JavaScriptFile:', () => {
    describe('JavaScriptFile constructor:', () => {
        it('should create a new JavaScriptFile', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should inherit from File', () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('JavaScriptFile.meta:', () => {
        it('should read the files metadata', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/meta'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'metadata.js'), fileStructure);

            const { version } = await file.meta() as JavaScriptFileMetaItem;
            expect(version).to.equal('0.1.0');
        });

        it('should return null if there is not metadata', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/meta'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'no-metadata.js'), fileStructure);

            const metadata = await file.meta();
            expect(metadata).to.equal(null);
        });

        it(`should only read the file if it hasn't already been read`, async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/meta'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'metadata.js'), fileStructure);
            const read = jest.spyOn(file, 'read');

            await file.meta();
            await file.meta();

            expect(read.mock.calls.length).to.equal(1);
        });
    });

    describe('JavaScriptFile.read:', () => {
        it('should read the file from disk', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/read'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'contents.js'), fileStructure);

            const contents = await file.read();
            expect(contents).to.equal(`module.exports.tractor = '🚜';\n`);
        });

        it('should parse the contents', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/read'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'contents.js'), fileStructure);

            await file.read();
            expect(file.ast).to.deep.equal(parseScript(`module.exports.tractor = '🚜';`, {
                comment: true
            }));
        });

        it('should update the references between files', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/read'));
            const reference = new JavaScriptFile(path.join(fileStructure.path, 'contents.js'), fileStructure);
            await reference.read();
            const file = new JavaScriptFile(path.join(fileStructure.path, 'references.js'), fileStructure);

            await file.read();
            expect(file.references).to.deep.equal([reference]);
            expect(reference.referencedBy).to.deep.equal([file]);
        });

        it('should turn log any errors and create a TractorError', async () => {
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/read'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'error.js'), fileStructure);

            try {
                await file.read();
            } catch (tractorError) {
                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Parsing "${path.join(fileStructure.path, 'error.js')}" failed.`);
                expect(tractorError.status).to.equal(REQUEST_ERROR);
            }
        });
    });

    describe('JavaScriptFile.refactor:', () => {
        it('should refactor a JavaScript file', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/refactor'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'refactor-file.js'), fileStructure);
            await file.save(`const tractor = 'brrrmmm';`);

            await file.refactor('identifierChange', {
                newName: 'TRACTOR',
                oldName: 'tractor'
            });

            try {
                const contents = await readFile(file.path);
                expect(contents.toString()).to.equal(`const TRACTOR = 'brrrmmm';`);
            } catch {
                expect(true).to.equal('`readFile` should not throw');
            }

            await file.cleanup();
        });

        it(`should do nothing if the action doesn't exist the JavaScriptFileRefactorer`, async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/refactor'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'refactor-invalid.js'), fileStructure);
            await file.save(`const tractor = 'brrrmmm';`);

            await file.refactor('someRefactorAction');

            try {
                const contents = await readFile(file.path);
                expect(contents.toString()).to.equal(`const tractor = 'brrrmmm';`);
            } catch {
                expect(true).to.equal('`readFile` should not throw');
            }

            await file.cleanup();
        });
    });

    describe('JavaScriptFile.save:', () => {
        it('should save a JavaScript string to disk', async () => {
            const readFile = promisify(fs.readFile);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-string.js'), fileStructure);

            await file.save(`const tractor = '🚜';`);

            try {
                const contents = await readFile(file.path);
                expect(contents.toString()).to.equal(`const tractor = '🚜';`);
            } catch {
                expect(true).to.equal('`readFile` should not throw');
            }

            await file.cleanup();
        });

        it('should assign the `comments` to `leadingComments`', async () => {
            const ast = parseScript('// comment', { comment: true });
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-comments.js'), fileStructure);

            await file.save(ast);
            expect(ast.leadingComments).to.deep.equal([{ type: 'Line', value: ' comment' }]);

            await file.cleanup();
        });

        it('should generate JavaScript from the AST', async () => {
            const readFile = promisify(fs.readFile);
            const ast = parseScript(`const tractor = 'brrrrmmm';`);
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-ast.js'), fileStructure);

            await file.save(ast);

            try {
                const contents = await readFile(file.path);
                expect(contents.toString()).to.equal(`const tractor = 'brrrrmmm';`);
            } catch {
                expect(true).to.equal('`readFile` should not throw');
            }

            await file.cleanup();
        });

        it('should rebuild any regular expressions in the AST', async () => {
            const ast = parseScript('/regex/', { comment: true });
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-regex.js'), fileStructure);

            await file.save(ast);
            expect(ast).to.deep.equal({
                body: [{
                    expression: {
                        raw: '/regex/',
                        regex: {
                            flags: '',
                            pattern: 'regex'
                        },
                        type: 'Literal',
                        value: /regex/,
                    },
                    type: 'ExpressionStatement'
                }],
                comments: [],
                leadingComments: [],
                sourceType: 'script',
                type: 'Program'
              });

            await file.cleanup();
        });

        it('should rebuild any complicated regular expressions in the AST', async () => {
            const ast = parseScript('/\\/regex\\//ig', { comment: true });
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-regex.js'), fileStructure);

            await file.save(ast);
            expect(ast).to.deep.equal({
                body: [{
                    expression: {
                        raw: '/\\/regex\\//ig',
                        regex: {
                            flags: 'ig',
                            pattern: '\\/regex\\/'
                        },
                        type: 'Literal',
                        value: /\/regex\//gi,
                    },
                    type: 'ExpressionStatement'
                }],
                comments: [],
                leadingComments: [],
                sourceType: 'script',
                type: 'Program'
              });

            await file.cleanup();
        });

        it('should turn log any errors and create a TractorError', async () => {
            const ast = parseScript('');
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures/save'));
            const file = new JavaScriptFile(path.join(fileStructure.path, 'save-error.js'), fileStructure);
            const save = jest.spyOn(File.prototype, 'save').mockImplementation(async () => {
                throw new Error();
            });

            try {
                await file.save(ast);
            } catch (error) {
                expect(error).to.be.an.instanceof(TractorError);
                expect(error.message).to.equal(`Saving "${path.join(fileStructure.path, 'save-error.js')}" failed.`);
                expect(error.status).to.equal(REQUEST_ERROR);
            }

            save.mockRestore();
        });
    });

    describe('JavaScriptFile.serialise:', () => {
        it(`should include the file's AST`, () => {
            const ast = parseScript('');
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            file.serialise();

            expect(file.ast).to.equal(ast);
        });
    });

    describe('JavaScriptFile.toJSON:', () => {
        it(`should not include the file's AST`, () => {
            const ast = parseScript('');
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            const json = file.toJSON();

            expect(json.ast).to.equal(undefined);
        });

        it('should include the parsed metadata', () => {
            const metadata = {
                name: 'javascrpt file'
            };
            const ast = parseScript(`// ${JSON.stringify(metadata)}`, { comment: true });
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            const json = file.toJSON();

            expect(json.meta).to.deep.equal(metadata);
        });

        it('should handle invalid JSON', () => {
            const ast = parseScript('// Not JSON', { comment: true });
            const fileStructure = new FileStructure(path.resolve(__dirname, '../fixtures'));
            const filePath = path.join(fileStructure.path, 'test.js');

            const file = new JavaScriptFile(filePath, fileStructure);
            file.ast = ast;

            const json = file.toJSON();

            expect(json.meta).to.deep.equal(null);
        });
    });
});
