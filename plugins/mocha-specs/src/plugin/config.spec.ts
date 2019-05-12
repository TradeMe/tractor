// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { config } from './config';

describe('@tractor-plugins/mocha-specs - tractor/config:', () => {
    describe('addConfig', () => {
        it('should process the config object', () => {
            let mochaSpecsConfig = {};
            let tractorConfig = {
                mochaSpecs: mochaSpecsConfig
            };

            let processed = config(tractorConfig);

            expect(processed).to.equal(mochaSpecsConfig);
            expect(processed.mochaSpecs.directory).to.equal('./tractor/mocha-specs');
            expect(processed.mochaSpecs.reportsDirectory).to.equal('./tractor/reports');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                mochaSpecs: {
                    directory: './src'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.mochaSpecs.directory).to.equal('./src');
        });

        it('should allow for a custom report directory to be set', () => {
            let tractorConfig = {
                mochaSpecs: {
                    reportsDirectory: './reports'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.mochaSpecs.reportsDirectory).to.equal('./reports');
        });
    });
});
