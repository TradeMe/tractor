/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import path from 'path';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import { File } from './File';
import { FileStructure } from './FileStructure';

// Under test:
import { References } from './References';

describe('tractor-file-structure - References:', () => {
    describe('References constructor:', () => {
        it('should create a new References', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let references = new References(fileStructure);

            expect(references).to.be.an.instanceof(References);
        });
    });

    describe('References.addFileStructure', () => {
        it('should add another FileStructure to the References', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let references = new References(fileStructure);

            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));

            references.addFileStructure(otherFileStructure);

            expect(references.getFileStructures()).to.deep.equal([fileStructure, otherFileStructure]);
        });

        it('should add the References to the other FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let references = new References(fileStructure);

            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));

            references.addFileStructure(otherFileStructure);

            expect(otherFileStructure.references.getFileStructures()).to.deep.equal([otherFileStructure, fileStructure]);
        });
    });

    describe('References.getFileStructureReferences', () => {
        it('should return the References of all of the FileStructures', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let references = new References(fileStructure);
            references.addFileStructure(otherFileStructure);

            expect(references.getFileStructureReferences()).to.deep.equal([fileStructure.references, otherFileStructure.references]);
        });
    });

    describe('References.addReference', () => {
        it('should add a reference to the file from the other file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);
        });

        it('should append to the list of referencesTo', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);
            let oneMoreFile = new File(path.join(path.sep, 'file-structure', 'one-more-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);
            references.addReference(file, oneMoreFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile, oneMoreFile]);
        });

        it('should add a reference from the file to the other file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);
        });

        it('should append to the list of referencesFrom', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);
            let oneMoreFile = new File(path.join(path.sep, 'file-structure', 'one-more-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);
            references.addReference(oneMoreFile, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file, oneMoreFile]);
        });
    });

    describe('References.getReference', () => {
        it('should get a file from the current FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);

            let references = new References(fileStructure);

            expect(references.getReference(file.path)).to.equal(file);
        });

        it('should get a file from an added FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let file = new File(path.join(path.sep, 'other-file-structure', 'file'), otherFileStructure);

            let references = new References(fileStructure);
            references.addFileStructure(otherFileStructure);

            expect(references.getReference(file.path)).to.equal(file);
        });

        it(`should return null if the file doesn't exist`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let references = new References(fileStructure);

            expect(references.getReference(path.join(path.sep, 'some-file'))).to.equal(null);
        });
    });

    describe('References.getReferenceTo', () => {
        it('should return the recorded references to a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);
        });

        it('should include any references from another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { references } = fileStructure;
            references.addFileStructure(otherFileStructure);

            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);
        });
    });

    describe('References.getReferencesFrom', () => {
        it('should return the recorded references from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;

            references.addReference(file, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);
        });

        it('should include any references from another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { references } = fileStructure;
            references.addFileStructure(otherFileStructure);

            references.addReference(file, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);
        });
    });

    describe('References.clearReferences', () => {
        it('should clear all references to and from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);
            let { references } = fileStructure;
            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);
            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);

            references.clearReferences(file.path);

            expect(references.getReferencesTo(file.path)).to.deep.equal([]);
            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([]);
        });
    });

    describe('References.clearReferencesTo', () => {
        it('should clear all the references to a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;
            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);

            references.clearReferencesTo(file.path);

            expect(references.getReferencesTo(file.path)).to.deep.equal([]);
        });

        it('should clear all the references to a file in another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { references } = fileStructure;
            references.addFileStructure(otherFileStructure);
            references.addReference(file, otherFile);

            expect(references.getReferencesTo(file.path)).to.deep.equal([otherFile]);

            references.clearReferencesTo(file.path);

            expect(references.getReferencesTo(file.path)).to.deep.equal([]);
        });

        it('should do nothing if there are no references for a given path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;
            references.addReference(file, otherFile);

            expect(() => {
                references.clearReferencesTo('/some/file/path');
            }).to.not.throw();
        });
    });

    describe('References.clearReferencesFrom', () => {
        it('should clear all the references from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;
            references.addReference(file, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);

            references.clearReferencesFrom(otherFile.path);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([]);
        });

        it('should clear all the references from a file in another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { references } = fileStructure;
            references.addFileStructure(otherFileStructure);
            references.addReference(file, otherFile);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([file]);

            references.clearReferencesFrom(otherFile.path);

            expect(references.getReferencesFrom(otherFile.path)).to.deep.equal([]);
        });

        it('should do nothing if there are no references for a given path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { references } = fileStructure;
            references.addReference(file, otherFile);

            expect(() => {
                references.clearReferencesFrom('/some/file/path');
            }).to.not.throw();
        });
    });
});
