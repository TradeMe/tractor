// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/accessibility - description:', () => {
    it('should have the `checkPage` action', () => {
        const checkPage = description.actions.find(action => action.name === 'checkPage');
        expect(checkPage).to.not.equal(undefined);
    });

    it('should have the `checkSelector` action', () => {
        const checkSelector = description.actions.find(action => action.name === 'checkSelector');
        expect(checkSelector).to.not.equal(undefined);
    });
});
