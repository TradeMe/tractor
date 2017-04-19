/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

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
