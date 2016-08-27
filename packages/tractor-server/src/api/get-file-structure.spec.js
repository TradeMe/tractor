/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import fileStructure from '../file-structure';

// Under test:
import getFileStructure from './get-file-structure';

describe('server/api: get-file-structure:', () => {
    it('should get the file structure', () => {
        let type = 'type';
        let request = {
            params: { type }
        };
        let response = {
            send: _.noop
        };

        sinon.stub(fileStructure, 'getStructure');

        getFileStructure.handler(request, response);

        expect(fileStructure.getStructure).to.have.been.calledWith(type);

        fileStructure.getStructure.restore();
    });

    it('should respond to the client with the file structure', () => {
        let type = 'type';
        let request = {
            params: { type }
        };
        let response = {
            send: _.noop
        };
        let structure = {};

        sinon.stub(fileStructure, 'getStructure').returns(structure);
        sinon.stub(response, 'send');

        getFileStructure.handler(request, response);

        expect(response.send).to.have.been.calledWith(structure);

        fileStructure.getStructure.restore();
    });
});
