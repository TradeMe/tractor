/* global describe:true, it:true */
'use strict';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import fileStructure from '../../file-structure';
import transforms from './transforms';

// Under test:
import componentTransformer from './component-transformer';

describe('server/api/transformers: componentTransformer:', () => {
    it('should update the what other files reference a ComponentFile', () => {
        let oldReferences = fileStructure.references;

        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };
        fileStructure.references = {
            'old/path': ['/path/to/some/file']
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(fileStructure.references['new/path']).to.deep.equal(['/path/to/some/file']);
            expect(fileStructure.references['old/path']).to.be.undefined();
        })
        .finally(() => {
            fileStructure.references = oldReferences;

            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the path to a ComponentFile in all files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferencePath).to.have.been.calledWith('components', 'old/path', 'new/path', 'old name', 'new name');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of the constructor of a ComponentFile in files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferenceIdentifiers).to.have.been.calledWith('new/path', 'OldName', 'NewName');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of all instances of a ComponentFile in files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferenceIdentifiers).to.have.been.calledWith('new/path', 'oldName', 'newName');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of the constructor in a ComponentFile', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformIdentifiers).to.have.been.calledWith(file, 'OldName', 'NewName');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of the instance in a ComponentFile', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformIdentifiers).to.have.been.calledWith(file, 'oldName', 'newName');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of a ComponentFile in the metadata of files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformIdentifiers');
        sinon.stub(transforms, 'transformMetadata');
        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return componentTransformer(file, options)
        .then(() => {
            expect(transforms.transformMetadata).to.have.been.calledWith(file, null, 'old name', 'new name');
        })
        .finally(() => {
            transforms.transformIdentifiers.restore();
            transforms.transformMetadata.restore();
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });
});
