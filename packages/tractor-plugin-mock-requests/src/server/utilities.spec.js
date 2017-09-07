/* global describe:true, it:true */

import { expect } from '../../test-setup';

// Under test:
import { getConfig } from './utilities';

describe('tractor-plugin-mock-requests - utilities:', () => {
    describe('getConfig', () => {
        it('should create the config object', () => {
            let mockRequestsConfig = {};
            let tractorConfig = {
                mockRequests: mockRequestsConfig
            };

            let config = getConfig(tractorConfig);

            expect(config).to.equal(mockRequestsConfig);
            expect(config.port).to.equal(8765);
        });

        it('should allow for a custom domain to be set', () => {
            let tractorConfig = {
                mockRequests: {
                    domain: 'tractor.co.nz'
                }
            };

            let config = getConfig(tractorConfig);

            expect(config.domain).to.equal('tractor.co.nz');
        });

        it('should allow for a custom port to be set', () => {
            let tractorConfig = {
                mockRequests: {
                    port: 1000
                }
            };

            let config = getConfig(tractorConfig);

            expect(config.port).to.equal(1000);
        });
    });
});
