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
import { EventEmitter } from 'events';
import { fileStructure } from '../file-structure';

// Under test:
import { watchFileStructure } from './watch-file-structure';

describe('tractor-file-structure - actions/watch-file-structure:', () => {
    it('should start watching the file structure', () => {
        let socket = {
            emit: () => {}
        };
        let watcher = new EventEmitter();

        sinon.stub(fileStructure, 'watch').returns(watcher);
        sinon.stub(socket, 'emit');
        sinon.spy(watcher, 'on');

        watchFileStructure(socket);
        watcher.emit('change');

        expect(fileStructure.watch).to.have.been.called();
        expect(watcher.on).to.have.been.calledWith('change');
        expect(socket.emit).to.have.been.calledWith('file-structure-change');

        fileStructure.watch.restore();
    });
});
