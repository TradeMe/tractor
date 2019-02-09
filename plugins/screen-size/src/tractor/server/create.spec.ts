// Test setup:
import { expect, ineeda } from '@tractor/unit-test';

// Dependencies:
import { ProtractorBrowser } from 'protractor';
import { TractorScreenSizeConfigInternal } from '../screen-size-config';
import { ScreenSize } from './screen-size/screen-size';

// Under test:
import { create } from './create';

describe('@tractor-plugins/screen-size - create:', () => {
    it('should make a new ScreenSize', () => {
        const browser = ineeda<ProtractorBrowser>();
        const config = ineeda<TractorScreenSizeConfigInternal>();

        const screenSize = create(browser, config);

        expect(screenSize).to.be.an.instanceof(ScreenSize);
    });
});
