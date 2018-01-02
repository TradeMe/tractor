import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinonChai from 'sinon-chai';

export { expect } from 'chai';
export sinon from 'sinon';

global.Promise = Promise;

// Test setup:
chai.use(dirtyChai);
chai.use(sinonChai);
