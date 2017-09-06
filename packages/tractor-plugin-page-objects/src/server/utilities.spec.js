/* global describe:true, it:true */

// Test setup:
import { expect } from '../../test-setup';

// Under test:
import { getConfig } from './utilities';

describe('tractor-plugin-page-objects - utilities:', () => {
    describe('getConfig', () => {
        it('should create the config object', () => {
            let pageObjectsConfig = {};
            let tractorConfig = {
                pageObjects: pageObjectsConfig
            };

            let config = getConfig(tractorConfig);

            expect(config).to.equal(pageObjectsConfig);
            expect(config.directory).to.equal('./tractor/page-objects');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                pageObjects: {
                    directory: './src'
                }
            };

            let config = getConfig(tractorConfig);

            expect(config.directory).to.equal('./src');
        });
    });
});
