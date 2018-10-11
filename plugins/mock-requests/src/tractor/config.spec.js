import { expect } from '@tractor/unit-test';

// Under test:
import { config } from './config';

describe('@tractor-plugins/mock-requests - config:', () => {
    describe('config', () => {
        it('should create the config object', () => {
            let mockRequestsConfig = {};
            let tractorConfig = {
                mockRequests: mockRequestsConfig
            };

            let processed = config(tractorConfig);

            expect(processed).to.equal(mockRequestsConfig);
            expect(processed.port).to.equal(8765);
        });

        it('should allow for a custom domain to be set', () => {
            let tractorConfig = {
                mockRequests: {
                    domain: 'tractor.co.nz'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.domain).to.equal('tractor.co.nz');
        });

        it('should allow for a custom port to be set', () => {
            let tractorConfig = {
                mockRequests: {
                    port: 1000
                }
            };

            let processed = config(tractorConfig);

            expect(processed.port).to.equal(1000);
        });
    });
});
