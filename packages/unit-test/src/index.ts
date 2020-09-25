import * as chai from 'chai';
import { ineeda } from 'ineeda';
import * as npmlog from 'npmlog';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

// HACK:
// Duplicating `mute` logic from `@tractor/logger` so that we don't have a circular
// module dependency.
// The lint rule is broken, this assertion is necessary to overwriting "readonly".
// tslint:disable:no-unnecessary-type-assertion
(npmlog.level as string) = 'silent';

export const NOOP: () => void = (): void => {
    return;
};

export { expect } from 'chai';
import * as dedent from 'dedent';
export { dedent };
import * as getPort from 'get-port';
export { getPort };
export { ineeda } from 'ineeda';
export { sinon };

// Test setup:
chai.use(sinonChai);

// Prevent sinon from thinking ineeda mocks are already spies:
// tslint:disable ban-ts-ignore
// @ts-ignore TS2326
ineeda.intercept<sinon.SinonStub>({
    calledBefore: null,
    restore: null
});

// Prevent libraries from thinking ineeda mocks are Promises
// tslint:disable ban-ts-ignore
// @ts-ignore TS2326
ineeda.intercept<Promise<void>>({
    then: null
});

// Intercept all values that are functions and turn it into a stub
// HACK:
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
