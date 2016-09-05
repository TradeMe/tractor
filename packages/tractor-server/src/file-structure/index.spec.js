/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Dependencies:
import FileStructure from './FileStructure';

// Under test:
import { refresh } from './index';

describe('fileStructure:', () => {
    it('should return an instance of `FileStructure`', () => {
        let fileStructure1 = require('./index').default;

        expect(fileStructure1).to.be.an.instanceof(FileStructure);
    });

    it('should always return the same instance of `FileStructure`', () => {
        let fileStructure1 = require('./index').default;
        let fileStructure2 = require('./index').default;

        expect(fileStructure1).to.equal(fileStructure2);
    });

    describe('fileStructure.refresh:', () => {
        it('should reload the File System', () => {
            sinon.stub(FileStructure.prototype, 'init');
            sinon.stub(FileStructure.prototype, 'read').returns(Promise.resolve());

            return refresh()
            .then(() => {
                expect(FileStructure.prototype.init).to.have.been.called();
                expect(FileStructure.prototype.read).to.have.been.called();
            })
            .finally(() => {
                FileStructure.prototype.init.restore();
                FileStructure.prototype.read.restore();
            });
        });
    });
});
