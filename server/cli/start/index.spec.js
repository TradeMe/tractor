/* global describe:true, it:true */
'use strict';

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
import application from '../../application';
import * as fileStructure from '../../file-structure';

// Under test:
import cliStart from './index';

describe('server/start: index:', () => {
    it('should start the application', () => {
        sinon.stub(fileStructure, 'refresh').returns(Promise.resolve());
        sinon.stub(application, 'start').returns(Promise.resolve());

        return cliStart()
        .then(() => {
            expect(application.start).to.have.been.called();

            application.start.restore();
        });
    });
});
