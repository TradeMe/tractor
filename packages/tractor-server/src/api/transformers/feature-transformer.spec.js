/* global describe:true, it:true */
'use strict';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import os from 'os';

// Under test:
import featureTransformer from './feature-transformer';

describe('server/api/transformers: featureTransformer:', () => {
    it('should update the name of the feature in a FeatureFile', () => {
        let file = {
            content: `Feature: old name${os.EOL}`
        };
        let options = {
            oldName: 'old name',
            newName: 'new name'
        };

        return featureTransformer(file, options)
        .then(() => {
            expect(file.content).to.equal(`Feature: new name${os.EOL}`);
        });
    });
});
