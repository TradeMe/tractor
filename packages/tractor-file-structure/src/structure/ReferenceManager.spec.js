// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import path from 'path';
import { File } from './File';
import { FileStructure } from './FileStructure';

// Under test:
import { ReferenceManager } from './ReferenceManager';

describe('@tractor/file-structure - ReferenceManager:', () => {
    describe('ReferenceManager constructor:', () => {
        it('should create a new ReferenceManager', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let referenceManager = new ReferenceManager(fileStructure);

            expect(referenceManager).to.be.an.instanceof(ReferenceManager);
        });
    });

    describe('ReferenceManager.addFileStructure', () => {
        it('should add another FileStructure to the ReferenceManager', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let referenceManager = new ReferenceManager(fileStructure);

            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));

            referenceManager.addFileStructure(otherFileStructure);

            expect(referenceManager.getFileStructures()).to.deep.equal([fileStructure, otherFileStructure]);
        });

        it('should add the ReferenceManager to the other FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let referenceManager = new ReferenceManager(fileStructure);

            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));

            referenceManager.addFileStructure(otherFileStructure);

            expect(otherFileStructure.referenceManager.getFileStructures()).to.deep.equal([otherFileStructure, fileStructure]);
        });
    });

    describe('ReferenceManager.addReference', () => {
        describe('references', () => {
            it('should add a reference to the file from the other file', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);

                expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);
            });

            it('should only be added once', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);
                referenceManager.addReference(file, otherFile);

                expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);
            });

            it('should append to the list of referencesTo', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);
                let oneMoreFile = new File(path.join(path.sep, 'file-structure', 'one-more-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);
                referenceManager.addReference(file, oneMoreFile);

                expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile, oneMoreFile]);
            });
        });

        describe('referencedBy', () => {
            it('should add a reference from the file to the other file', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);

                expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);
            });

            it('should only be added once', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);
                referenceManager.addReference(file, otherFile);

                expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);
            });

            it('should append to the list of referencedBy', () => {
                let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
                let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
                let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);
                let oneMoreFile = new File(path.join(path.sep, 'file-structure', 'one-more-file'), fileStructure);

                let { referenceManager } = fileStructure;

                referenceManager.addReference(file, otherFile);
                referenceManager.addReference(oneMoreFile, otherFile);

                expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file, oneMoreFile]);
            });
        });
    });

    describe('ReferenceManager.getReference', () => {
        it('should get a file from the current FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);

            let referenceManager = new ReferenceManager(fileStructure);

            expect(referenceManager.getReference(file.path)).to.equal(file);
        });

        it('should get a file from an added FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let file = new File(path.join(path.sep, 'other-file-structure', 'file'), otherFileStructure);

            let referenceManager = new ReferenceManager(fileStructure);
            referenceManager.addFileStructure(otherFileStructure);

            expect(referenceManager.getReference(file.path)).to.equal(file);
        });

        it(`should return null if the file doesn't exist`, () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));

            let referenceManager = new ReferenceManager(fileStructure);

            expect(referenceManager.getReference(path.join(path.sep, 'some-file'))).to.equal(null);
        });
    });

    describe('ReferenceManager.getReferences', () => {
        it('should return the recorded references to a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;

            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);
        });

        it('should include any references from another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addFileStructure(otherFileStructure);

            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);
        });
    });

    describe('ReferenceManager.getReferencedBy', () => {
        it('should return the recorded references from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;

            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);
        });

        it('should include any references from another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addFileStructure(otherFileStructure);

            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);
        });
    });

    describe('ReferenceManager.clearReferences', () => {
        it('should clear all the references to a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);

            referenceManager.clearReferences(file.path);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([]);
        });

        it('should clear all the references to a file in another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addFileStructure(otherFileStructure);
            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([otherFile]);

            referenceManager.clearReferences(file.path);

            expect(referenceManager.getReferences(file.path)).to.deep.equal([]);
        });

        it('should do nothing if there are no references for a given path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addReference(file, otherFile);

            expect(() => {
                referenceManager.clearReferences('/some/file/path');
            }).to.not.throw();
        });
    });

    describe('ReferenceManager.clearReferencedBy', () => {
        it('should clear all the references from a file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);

            referenceManager.clearReferencedBy(otherFile.path);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([]);
        });

        it('should clear all the references from a file in another FileStructure', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFileStructure = new FileStructure(path.join(path.sep, 'other-file-structure'));
            let otherFile = new File(path.join(path.sep, 'other-file-structure', 'other-file'), otherFileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addFileStructure(otherFileStructure);
            referenceManager.addReference(file, otherFile);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([file]);

            referenceManager.clearReferencedBy(otherFile.path);

            expect(referenceManager.getReferencedBy(otherFile.path)).to.deep.equal([]);
        });

        it('should do nothing if there are no references for a given path', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let file = new File(path.join(path.sep, 'file-structure', 'file'), fileStructure);
            let otherFile = new File(path.join(path.sep, 'file-structure', 'other-file'), fileStructure);

            let { referenceManager } = fileStructure;
            referenceManager.addReference(file, otherFile);

            expect(() => {
                referenceManager.clearReferencedBy('/some/file/path');
            }).to.not.throw();
        });
    });
});
