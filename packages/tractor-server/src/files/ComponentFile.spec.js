/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import JavaScriptFile from './JavaScriptFile';
import { TractorError } from 'tractor-error-handler';
import { File, FileStructure } from 'tractor-file-structure';
import transformer from 'tractor-js-file-transformer';

// Under test:
import ComponentFile from './ComponentFile';

describe('server/files: ComponentFile:', () => {
    describe('ComponentFile constructor:', () => {
        it('should create a new ComponentFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(ComponentFile);
        });

        it('should inherit from JavaScriptFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(JavaScriptFile);
        });

        it('should have a `type` of "components"', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file.type).to.equal('components');
        });

        it('should have an `extension` of ".component.js"', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new ComponentFile(filePath, fileStructure);

            expect(file.extension).to.equal('.component.js');
        });
    });

    describe('ComponentFile.delete:', () => {
        it('should delete the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, fileStructure);

            return file.delete()
            .then(() => {
                expect(File.prototype.delete).to.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });

        it('should delete the list of references to the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            fileStructure.references[filePath] = [];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, fileStructure);

            return file.delete()
            .then(() => {
                expect(fileStructure.references[filePath]).to.be.undefined();
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });

        it('should throw an error if the component is referenced by other files', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            fileStructure.references[filePath] = ['fake reference'];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());

            let file = new ComponentFile(filePath, fileStructure);

            return file.delete()
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Cannot delete ${file.path} as it is referenced by another file.`));
            })
            .finally(() => {
                File.prototype.delete.restore();
            });
        });

        it('should not throw an error if `isMove` is true', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            fileStructure.references[filePath] = [];

            sinon.stub(File.prototype, 'delete').returns(Promise.resolve());
            sinon.spy(Promise, 'reject');

            let file = new ComponentFile(filePath, fileStructure);

            return file.delete({ isMove: true })
            .then(() => {
                expect(Promise.reject).to.not.have.been.called();
            })
            .finally(() => {
                File.prototype.delete.restore();
                Promise.reject.restore();
            });
        });
    });

    describe('ComponentFile.move:', () => {
        it('should move the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(File.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                Promise.map.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
            });
        });

        it('should update the class name of the component', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformIdentifiers).to.have.been.calledWith(newFile, 'File', 'NewFile', 'VariableDeclarator');
                expect(transformer.transformIdentifiers).to.have.been.calledWith(newFile, 'File', 'NewFile', 'FunctionExpression');
                expect(transformer.transformIdentifiers).to.have.been.calledWith(newFile, 'File', 'NewFile', 'MemberExpression MemberExpression');
                expect(transformer.transformIdentifiers).to.have.been.calledWith(newFile, 'File', 'NewFile', 'ReturnStatement');
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                Promise.map.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
            });
        });

        it('should update the class name of the component in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.component.js');
            let referenceFile = new ComponentFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'File', 'NewFile', 'VariableDeclarator');
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'File', 'NewFile', 'NewExpression');
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
            });
        });

        it('should update the instance name of the component in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.component.js');
            let referenceFile = new ComponentFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'file', 'newFile', 'VariableDeclarator');
                expect(transformer.transformIdentifiers).to.have.been.calledWith(referenceFile, 'file', 'newFile', 'CallExpression MemberExpression');
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
            });
        });

        it('should update the metadata of the component in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.component.js');
            let referenceFile = new ComponentFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformMetadata).to.have.been.calledWith(referenceFile, 'file', 'new file', 'components');
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
            });
        });

        it('should update the require path to the component in files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.component.js');
            let referenceFile = new ComponentFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(transformer.transformRequirePaths).to.have.been.calledWith(referenceFile, {
                    fromPath: referenceFilePath,
                    oldToPath: filePath,
                    newToPath: newFilePath
                });
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
            });
        });

        it('should save any files that reference it', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);
            let referenceFilePath = path.join(path.sep, 'file-structure', 'directory', 'reference file.component.js');
            let referenceFile = new ComponentFile(referenceFilePath, fileStructure);
            fileStructure.references[filePath] = [referenceFile.path];

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');
            sinon.stub(transformer, 'transformRequirePaths');

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(JavaScriptFile.prototype.save).to.have.been.calledOn(referenceFile);
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
                transformer.transformRequirePaths.restore();
            });
        });

        it('should throw if updating references fails', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.component.js');
            let file = new ComponentFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.component.js');
            let newFile = new ComponentFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(JavaScriptFile.prototype, 'save').returns(Promise.resolve());
            sinon.stub(Promise, 'map').returns(Promise.reject());
            sinon.stub(transformer, 'transformIdentifiers');
            sinon.stub(transformer, 'transformMetadata');

            let update = {};
            let options = {};

            return file.move(update, options)
            .catch(e => {
                expect(e).to.deep.equal(new TractorError(`Could not update references after moving ${filePath}.`));
            })
            .finally(() => {
                File.prototype.move.restore();
                JavaScriptFile.prototype.save.restore();
                Promise.map.restore();
                transformer.transformIdentifiers.restore();
                transformer.transformMetadata.restore();
            });
        });
    });
});
