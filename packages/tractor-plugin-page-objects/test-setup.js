import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { ineeda } from 'ineeda';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

export const NOOP = () => {}

export dedent from 'dedent';
export Promise from 'bluebird';
export { expect } from 'chai';
export { ineeda } from 'ineeda';
export sinon from 'sinon';

// Test setup:
chai.use(dirtyChai);
chai.use(sinonChai);

// Prevent sinon from thinking ineeda mocks are already spies:
ineeda.intercept({
    restore: null,
    calledBefore: null
});

// Intercept all values that are functions and turn it into a stub:
ineeda.intercept((value, key, values, target) => {
    if (value instanceof Function) {
        target[key] = NOOP;
        return sinon.stub(target, key).callsFake(values[key]);
    }
    return value;
});
