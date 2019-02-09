// Test setup:
import { expect } from '@tractor/unit-test';

// Dependencies:

// Under test:
import { config } from './config';

describe('@tractor-plugins/screen-size - config:', () => {
    it('should make sure there is a `screenSizes` property', () => {
        const tractorConfig = config({});

        expect(tractorConfig.screenSizes).to.not.equal(undefined);
    });

    it(`should handle the 'maximize' case`, () => {
        const tractorConfig = config({
            screenSizes: {
                sm: 'maximize'
            }
        });

        expect(tractorConfig.screenSizes.sm).to.equal('maximize');
    });

    it(`should handle the 'default' case`, () => {
        const tractorConfig = config({
            screenSizes: {
                default: 'sm',
                sm: { width: 480, height: 1000 }
            }
        });

        expect(tractorConfig.screenSizes.default).to.equal(tractorConfig.screenSizes.sm);
    });

    it(`should handle the 'just width number' case`, () => {
        const tractorConfig = config({
            screenSizes: {
                sm: 480
            }
        });

        expect(tractorConfig.screenSizes.sm).to.deep.equal({ width: 480, height: 1000 });
    });

    it(`should handle the 'just width number' case`, () => {
        const tractorConfig = config({
            screenSizes: {
                sm: { width: 480 }
            }
        });

        expect(tractorConfig.screenSizes.sm).to.deep.equal({ width: 480, height: 1000 });
    });
});
