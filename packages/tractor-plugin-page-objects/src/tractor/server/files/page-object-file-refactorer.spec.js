/* global describe:true, it:true */

// Test setup:
import { dedent, expect, Promise, sinon } from '../../../../test-setup';

// Dependencies:
import escodegen from 'escodegen';
import * as esprima from 'esprima';
import path from 'path';
import { FileStructure } from 'tractor-file-structure';
import { PageObjectFile } from './page-object-file';

// Under test:
import { PageObjectFileRefactorer } from './page-object-file-refactorer';

describe('tractor-plugin-page-objects - page-object-file-refactorer:', () => {
    describe('PageObjectFileRefactorer.fileNameChange', () => {
        it('should update the name of the page object in a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new PageObjectFile(path.join(path.sep, 'file-structure', 'directory', 'file.po.js'), fileStructure);

            sinon.stub(PageObjectFile.prototype, 'save').returns(Promise.resolve());

            file.ast = esprima.parseScript(`
                /*{"name":"foo","elements":[],"actions":[{"name":"baz","parameters":[]}]}*/
                module.exports = function () {
                    var Foo = function Foo() { };
                    Foo.prototype.baz = function () { };
                    return Foo;
                }();
            `, {
                comment: true
            });

            return PageObjectFileRefactorer.fileNameChange(file, {
                oldName: 'foo',
                newName: 'bar'
            })
            .then(() => {
                file.ast.leadingComments = file.ast.comments;
                let po = escodegen.generate(file.ast, {
                    comment: true
                });

                expect(po).to.equal(dedent(`
                    /*{"name":"bar","elements":[],"actions":[{"name":"baz","parameters":[]}]}*/
                    module.exports = function () {
                        var Bar = function Bar() {
                        };
                        Bar.prototype.baz = function () {
                        };
                        return Bar;
                    }();
                `));
            })
            .finally(() => {
                PageObjectFile.prototype.save.restore();
            });
        });
    });
});
