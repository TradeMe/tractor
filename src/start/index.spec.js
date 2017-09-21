/* global describe:true, it:true */

// Test setup:
import { expect, ineeda } from '../../test-setup';

// Dependencies:
import Promise from 'bluebird';
import { server } from 'tractor-server';

// Under test:
import { start } from './index';

describe('tractor - start:', () => {
    it('should start the application', () => {
        let di = ineeda({
            call: () => Promise.resolve()
        });

        return start(di)
        .then(() => {
            expect(di.call).to.have.been.calledWith(server);
        });
    });
});
