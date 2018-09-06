// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { description } from './description';

describe('@tractor-plugins/screen-size - description:', () => {
    it('should have the `setSize` action', () => {
        let setSize = description.actions.find(action => action.name === 'set size');
        expect(setSize).to.not.be.undefined();
    });

    it('should have the `getHeight` action', () => {
        let getHeight = description.actions.find(action => action.name === 'get height');
        expect(getHeight).to.not.be.undefined();
    });

    it('should have the `getWidth` action', () => {
        let getWidth = description.actions.find(action => action.name === 'get width');
        expect(getWidth).to.not.be.undefined();
    });
});
