/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import { MockRequests } from './mock-requests';

// Under test:
import addHooks from './add-hooks';

describe('tractor-plugin-mock-requests - add-hooks:', () => {
    it('should be annotated with DI', () => {
        expect(addHooks['@Inject']).to.deep.equal(['browser', 'config', 'cucumber']);
    });

    describe('"Before" hook', () => {
        it('should set up the "Before" hook', () => {
            let browser = {};
            let config = {};
            let cucumber = {
                After: () => {},
                Before: () => {}
            };

            sinon.stub(cucumber, 'Before');

            addHooks(browser, config, cucumber);

            expect(cucumber.Before).to.have.been.called();
        });

        it('should create an instance of MockRequests', () => {
            let browser = {};
            let config = {};
            let cucumber = {
                After: () => {},
                Before: () => {}
            };
            let scenario = () => {};
            let callback = () => {};

            sinon.stub(cucumber, 'Before').callsFake((handler) => handler(scenario, callback));

            addHooks(browser, config, cucumber);

            expect(global.mockRequests).to.be.an.instanceof(MockRequests);
        });
    });

    describe('"After" hook', () => {
        it('should set up the "After" hook', () => {
            let browser = {};
            let config = {};
            let cucumber = {
                After: () => {},
                Before: () => {}
            };

            sinon.stub(cucumber, 'After');

            addHooks(browser, config, cucumber);

            expect(cucumber.After).to.have.been.called();
        });

        it('should clear out the mock responses', () => {
            let browser = {};
            let config = {};
            let cucumber = {
                After: () => {},
                Before: () => {}
            };
            let scenario = () => {};
            let callback = () => {};
            let mockRequests = new MockRequests(browser, config);

            global.mockRequests = mockRequests;

            sinon.stub(cucumber, 'After').callsFake((handler) => handler(scenario, callback));
            sinon.stub(mockRequests, 'clear');

            addHooks(browser, config, cucumber);

            expect(mockRequests.clear).to.have.been.called();
        });
    });
});
