// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/screen-size - description:', () => {
    it('should have the `setSize` action', () => {
        const setSize = description.actions.find(action => action.name === 'set size');
        expect(setSize).to.not.equal(undefined);
    });

    it('should have the `getHeight` action', () => {
        const getHeight = description.actions.find(action => action.name === 'get height');
        expect(getHeight).to.not.equal(undefined);
    });

    it('should have the `getWidth` action', () => {
        const getWidth = description.actions.find(action => action.name === 'get width');
        expect(getWidth).to.not.equal(undefined);
    });
});
