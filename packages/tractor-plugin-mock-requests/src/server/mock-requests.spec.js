/* global describe:true, it:true, Promise:true */

// Utilities:
import chai from 'chai';
import dedent from 'dedent';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import * as utilities from './utilities';

// Under test:
import { MockRequests } from './mock-requests';

describe('tractor-plugin-mock-requests - MockRequests:', () => {
    describe('constructor', () => {
        it('should create the config object', () => {
            let browser = {};
            let mockRequestsConfig = {};
            let config = {
                mockRequests: mockRequestsConfig
            };

            sinon.spy(utilities, 'getConfig');

            new MockRequests(browser, config);

            expect(utilities.getConfig).to.have.been.called();

            utilities.getConfig.restore();
        });

        it('should add specific methods for each method', () => {
            let browser = {};
            let config = {};

            let mockRequest = new MockRequests(browser, config);

            expect(mockRequest.whenDELETE).not.to.be.undefined();
            expect(mockRequest.whenGET).not.to.be.undefined();
            expect(mockRequest.whenHEAD).not.to.be.undefined();
            expect(mockRequest.whenPATCH).not.to.be.undefined();
            expect(mockRequest.whenPOST).not.to.be.undefined();
            expect(mockRequest.whenPUT).not.to.be.undefined();
        });

        describe('`browser.get`:', () => {
            it('should be overwritten', () => {
                let get = () => {};
                let browser = { get };
                let config = {};

                new MockRequests(browser, config);

                expect(browser.originalGet).to.equal(get);
                expect(browser.get).not.to.equal(get);
            });

            it('should be overwritten only once', () => {
                let get = () => {};
                let browser = { get };
                let config = {};

                new MockRequests(browser, config);
                new MockRequests(browser, config);

                expect(browser.originalGet).to.equal(get);
                expect(browser.get).not.to.equal(get);
            });

            it('should set the mockRequests to `initialised`', () => {
                let get = () => {};
                let browser = { get };
                let config = {};

                let mockRequests = new MockRequests(browser, config);

                sinon.stub(utilities, 'setProxyConfig').returns(Promise.resolve());

                return browser.get('/')
                .then(() => {
                    expect(mockRequests.initialised).to.be.true();

                    utilities.setProxyConfig.restore();
                });
            });

            it('should set the base path of the proxy', () => {
                let get = () => {};
                let browser = { baseUrl: 'http://tractor.trademe.co.nz', get };
                let config = {};

                new MockRequests(browser, config);

                sinon.stub(utilities, 'setProxyConfig').returns(Promise.resolve());

                return browser.get('/')
                .then(() => {
                    expect(utilities.setProxyConfig).to.have.been.calledWith({
                        host: 'http://tractor.trademe.co.nz'
                    }, 'http://localhost:8765/mock-requests/set-host');

                    utilities.setProxyConfig.restore();
                });
            });

            it('should call through to the original `get` function', () => {
                let get = () => {};
                let browser = { baseUrl: 'baseUrl', get };
                let config = {};

                new MockRequests(browser, config);

                sinon.stub(browser, 'originalGet').returns(Promise.resolve());
                sinon.stub(utilities, 'setProxyConfig').returns(Promise.resolve());

                return browser.get('/', 1000)
                .then(() => {
                    expect(browser.originalGet).to.have.been.calledWith('http://localhost:8765/', 1000);

                    utilities.setProxyConfig.restore();
                });
            })
        });
    });

    describe('clear:', () => {
        it('should clear out any mock responses', () => {
            let executeScript = () => {};
            let browser = { executeScript };
            let config = {};

            let mockRequests = new MockRequests(browser, config);

            sinon.stub(browser, 'executeScript');

            mockRequests.clear();

            expect(browser.executeScript).to.have.been.calledWith(dedent(`
                /* globals window */

                window.__tractor__ = window.__tractor__ || {};

                (function (tractor) {
                    tractor.mockResponses = {};
                })(window.__tractor__);
            `) + '\n');
        });
    });

    describe('when*', () => {
        it('should set default values for the mock', () => {
            let executeScript = () => {};
            let browser = { executeScript };
            let config = {};

            let mockRequests = new MockRequests(browser, config);
            mockRequests.initialised = true;

            sinon.stub(browser, 'executeScript').returns(Promise.resolve());

            return mockRequests.whenDELETE(/matcher/)
            .then(() => {
                expect(browser.executeScript).to.have.been.calledWith(dedent(`
                    window.__tractor__.mockResponses['{"method":"DELETE","matcher":"matcher"}'] = {"body":"{}","headers":{},"matcher":"matcher","method":"DELETE","passThrough":false,"status":200};
                `));
            });
        });

        it('should set values from the given options', () => {
            let executeScript = () => {};
            let browser = { executeScript };
            let config = {};

            let mockRequests = new MockRequests(browser, config);
            mockRequests.initialised = true;

            sinon.stub(browser, 'executeScript').returns(Promise.resolve());

            return mockRequests.whenGET(/matcher/, {
                body: { foo: 'bar' },
                headers: { key: 'value' },
                status: 418
            })
            .then(() => {
                expect(browser.executeScript).to.have.been.calledWith(dedent(`
                    window.__tractor__.mockResponses['{"method":"GET","matcher":"matcher"}'] = {"body":"{\\"foo\\":\\"bar\\"}","headers":{"key":"value"},"matcher":"matcher","method":"GET","passThrough":false,"status":418};
                `));
            });
        });

        it('should set up a pass-through', () => {
            let executeScript = () => {};
            let browser = { executeScript };
            let config = {};

            sinon.stub(browser, 'executeScript').returns(Promise.resolve());

            let mockRequests = new MockRequests(browser, config);
            mockRequests.initialised = true;

            return mockRequests.whenHEAD(/matcher/, {
                passThrough: true
            })
            .then(() => {
                expect(browser.executeScript).to.have.been.calledWith(dedent(`
                    window.__tractor__.mockResponses['{"method":"HEAD","matcher":"matcher"}'] = {"body":"{}","headers":{},"matcher":"matcher","method":"HEAD","passThrough":true,"status":200};
                `));
            });
        });

        it('should queue a call if the browser has not yet been initialised', () => {
            let browser = { };
            let config = {};

            sinon.stub(utilities, 'setProxyConfig').returns(Promise.resolve());

            let mockRequests = new MockRequests(browser, config);

            return mockRequests.whenPATCH(/matcher/)
            .then(() => {
                expect(utilities.setProxyConfig).to.have.been.calledWith({
                    mock: dedent(`
                        window.__tractor__.mockResponses['{"method":"PATCH","matcher":"matcher"}'] = {"body":"{}","headers":{},"matcher":"matcher","method":"PATCH","passThrough":false,"status":200};
                    `)
                },
                'http://localhost:8765/mock-requests/add-mock');

                utilities.setProxyConfig.restore();
            });
        });
    });
});
