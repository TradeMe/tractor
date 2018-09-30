// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { config } from './config';

describe('@tractor-plugins/visual-regressions - tractor/config:', () => {
    describe('addConfig', () => {
        it('should process the config object', () => {
            let visualRegressionConfig = {};
            let tractorConfig = {
                visualRegression: visualRegressionConfig
            };

            let processed = config(tractorConfig);

            expect(processed).to.equal(visualRegressionConfig);
            expect(processed.directory).to.equal('./tractor/visual-regression');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                visualRegression: {
                    directory: './images'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.directory).to.equal('./images');
        });
    });
});
