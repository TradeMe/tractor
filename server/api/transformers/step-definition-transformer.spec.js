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
import stepDefinitionTransformer from './step-definition-transformer';

describe('server/api/transformers: stepDefinitionTransformer:', () => {
    it('should update all the paths to the files that the step definition file references', () => {
        let file = {};
        let options = {
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        let oldReferences = fileStructure.references;
        fileStructure.references = {
            'referenced/path': ['old/path']
        };

        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());

        return stepDefinitionTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferencePath).to.have.been.calledWith(file, 'old/path', 'referenced/path', 'new/path', 'referenced/path');
        })
        .finally(() => {
            fileStructure.references = oldReferences;
            transforms.transformReferencePath.restore();
        });
    });

    it('should do nothing if the step definition file does not reference any other files', () => {
        let file = {};
        let options = {
            oldPath: 'old/path',
            newPath: 'new/path'
        };

        let oldReferences = fileStructure.references;
        fileStructure.references = {};

        sinon.stub(transforms, 'transformReferencePath').returns(Promise.resolve());

        return stepDefinitionTransformer(file, options)
        .then(() => {
            expect(transforms.transformReferencePath).to.not.have.been.called();
        })
        .finally(() => {
            fileStructure.references = oldReferences;
            transforms.transformReferencePath.restore();
        });
    });
});
