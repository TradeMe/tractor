// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:
import { ScreenSize } from './screen-size/screen-size';

// Under test:
import { create } from './create';

describe('@tractor-plugins/screen-size - create:', () => {
    it('should make a new ScreenSize', () => {
        let browser = {};
        let config = {};

        let screenSize = create(browser, config);

        expect(screenSize).to.be.an.instanceof(ScreenSize);
    });
});
