import * as chai from 'chai';
import { ineeda } from 'ineeda';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

export const NOOP: () => void = (): void => {
    return;
};

export { expect } from 'chai';
import * as dedent from 'dedent';
export { dedent };
export { ineeda } from 'ineeda';
export { sinon };

// Test setup:
chai.use(sinonChai);

// Prevent sinon from thinking ineeda mocks are already spies:
ineeda.intercept<sinon.SinonStub>({
    calledBefore: null,
    restore: null
});

// Prevent Bluebird from thinking ineeda mocks are Promises
ineeda.intercept<Promise<void>>({
    then: null
});

// Intercept all values that are functions and turn it into a stub
// Hack:
// Can't really predict the types here, so `any` makes the most sense.
// tslint:disable no-any no-unsafe-any
ineeda.intercept((value: any, key: keyof any, values: any, target: any): any => {
    if (value instanceof Function && values && target) {
        target[key] = NOOP;
        return sinon.stub(target, key).callsFake(values[key]);
    }
    return value;
});
// tslint:enable no-any no-unsafe-any
