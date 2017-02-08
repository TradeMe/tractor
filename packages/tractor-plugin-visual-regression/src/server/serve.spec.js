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
import { FileStructure } from 'tractor-file-structure';
import * as getDiffs from './actions/get-diffs';
import * as takeChanges from './actions/take-changes';
import * as watchFileStructure from './actions/watch-file-structure';

// Under test:
import serve from './serve';

describe('tractor-plugin-visual-regression - serve:', () => {
    it('should add a "get-diffs" endpoint', () => {
        let application = {
            get: () => {},
            put: () => {}
        };
        let sockets = {
            of: () => {}
        };
        let config = {
            testDirectory: ''
        };
        let handler = () => {};

        sinon.stub(application, 'get');
        sinon.stub(getDiffs, 'createGetDiffsHandler').returns(handler);
        sinon.stub(takeChanges, 'createTakeChangesHandler');
        sinon.stub(watchFileStructure, 'watchFileStructure');
        sinon.stub(FileStructure.prototype, 'read');

        serve(application, sockets, config);

        expect(application.get).to.have.been.calledWith('/visual-regression/get-diffs', handler);

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
        watchFileStructure.watchFileStructure.restore();
        FileStructure.prototype.read.restore();
    });

    it('should add a "take-changes" endpoint', () => {
        let application = {
            get: () => {},
            put: () => {}
        };
        let sockets = {
            of: () => {}
        };
        let config = {
            testDirectory: ''
        };
        let handler = () => {};

        sinon.stub(application, 'put');
        sinon.stub(getDiffs, 'createGetDiffsHandler');
        sinon.stub(takeChanges, 'createTakeChangesHandler').returns(handler);
        sinon.stub(watchFileStructure, 'watchFileStructure');
        sinon.stub(FileStructure.prototype, 'read');

        serve(application, sockets, config);

        expect(application.put).to.have.been.calledWith('/visual-regression/take-changes', handler);

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
        watchFileStructure.watchFileStructure.restore();
        FileStructure.prototype.read.restore();
    });

    it('should start emitting events on the "/watch-visual-regression" room', () => {
        let application = {
            get: () => {},
            put: () => {}
        };
        let sockets = {
            of: () => {}
        };
        let config = {
            testDirectory: ''
        };
        let socketsOf = () => {};

        sinon.stub(getDiffs, 'createGetDiffsHandler');
        sinon.stub(takeChanges, 'createTakeChangesHandler');
        sinon.stub(sockets, 'of').returns(socketsOf);
        sinon.stub(watchFileStructure, 'watchFileStructure');
        sinon.stub(FileStructure.prototype, 'read');

        serve(application, sockets, config);

        expect(sockets.of).to.have.been.calledWith('/watch-visual-regression');
        expect(watchFileStructure.watchFileStructure).to.have.been.calledWith(socketsOf);

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
        watchFileStructure.watchFileStructure.restore();
        FileStructure.prototype.read.restore();
    });

    it('should read the fileStructure', () => {
        let application = {
            get: () => {},
            put: () => {}
        };
        let sockets = {
            of: () => {}
        };
        let config = {
            testDirectory: ''
        };

        sinon.stub(getDiffs, 'createGetDiffsHandler');
        sinon.stub(takeChanges, 'createTakeChangesHandler');
        sinon.stub(watchFileStructure, 'watchFileStructure');
        sinon.stub(FileStructure.prototype, 'read');

        serve(application, sockets, config);

        expect(FileStructure.prototype.read).to.have.been.called();

        getDiffs.createGetDiffsHandler.restore();
        takeChanges.createTakeChangesHandler.restore();
        watchFileStructure.watchFileStructure.restore();
        FileStructure.prototype.read.restore();
    });
});
