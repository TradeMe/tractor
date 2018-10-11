// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { config } from './config';

describe('@tractor-plugins/page-objects - tractor/config:', () => {
    describe('addConfig', () => {
        it('should process the config object', () => {
            let pageObjectsConfig = {};
            let tractorConfig = {
                pageObjects: pageObjectsConfig
            };

            let processed = config(tractorConfig);

            expect(processed).to.equal(pageObjectsConfig);
            expect(processed.directory).to.equal('./tractor/page-objects');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                pageObjects: {
                    directory: './src'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.directory).to.equal('./src');
        });
    });
});
