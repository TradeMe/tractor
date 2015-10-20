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
import mockDataTransformer from './mock-data-transformer';

describe('server/api/transformers: mockDataTransformer:', () => {
    it('should update the what other files reference a MockDataFile', () => {
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

        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return mockDataTransformer(file, options)
        .then(() => {
            expect(fileStructure.references['new/path']).to.deep.equal(['/path/to/some/file']);
            expect(fileStructure.references['old/path']).to.be.undefined();
        })
        .finally(() => {
            fileStructure.references = oldReferences;

            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the path to a MockDataFile in all files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return mockDataTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferencePath).to.have.been.calledWith('mockData', 'old/path', 'new/path', 'old name', 'new name');
        })
        .finally(() => {
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });

    it('should update the name of the constructor of a MockDataFile in files that reference it', () => {
        let file = {};
        let options = {
            oldName: 'old name',
            newName: 'new name',
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());
        sinon.stub(transforms, 'transformReferenceIdentifiers').returns(Promise.resolve());

        return mockDataTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferenceIdentifiers).to.have.been.calledWith('new/path', 'oldName', 'newName');
        })
        .finally(() => {
            transforms.transformReferencePath.restore();
            transforms.transformReferenceIdentifiers.restore();
        });
    });
});
