import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

export const NOOP = () => {}

export { expect } from 'chai';
export sinon from 'sinon';

// Test setup:
chai.use(dirtyChai);
chai.use(sinonChai);
