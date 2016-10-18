/* global describe:true, it:true */

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import ComponentFile from '../files/ComponentFile';
import FeatureFile from '../files/FeatureFile';
import MockDataFile from '../files/MockDataFile';
import { FileStructure } from 'tractor-file-structure';
import StepDefinitionFile from '../files/StepDefinitionFile';

// Under test:
import './index';

describe('fileStructure:', () => {
    it('should return an instance of `FileStructure`', () => {
        let fileStructure = require('./index').default;

        expect(fileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should always return the same instance of `FileStructure`', () => {
        let fileStructure1 = require('./index').default;
        let fileStructure2 = require('./index').default;

        expect(fileStructure1).to.equal(fileStructure2);
    });

    it('should have `ComponentFile` as a registered file type:', () => {
        let fileStructure = require('./index').default;

        expect(fileStructure.fileExtensions['components']).to.equal('.component.js');
        expect(fileStructure.fileTypes['.component.js']).to.equal(ComponentFile);
    });

    it('should have `FeatureFile` as a registered file type:', () => {
        let fileStructure = require('./index').default;

        expect(fileStructure.fileExtensions['features']).to.equal('.feature');
        expect(fileStructure.fileTypes['.feature']).to.equal(FeatureFile);
    });

    it('should have `MockDataFile` as a registered file type:', () => {
        let fileStructure = require('./index').default;

        expect(fileStructure.fileExtensions['mock-data']).to.equal('.mock.json');
        expect(fileStructure.fileTypes['.mock.json']).to.equal(MockDataFile);
    });

    it('should have `StepDefinitionFile` as a registered file type:', () => {
        let fileStructure = require('./index').default;

        expect(fileStructure.fileExtensions['step-definitions']).to.equal('.step.js');
        expect(fileStructure.fileTypes['.step.js']).to.equal(StepDefinitionFile);
    });
});
