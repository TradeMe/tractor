/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../test-setup';

// Dependencies:
import path from 'path';
import { EventEmitter } from 'events';
import { FileStructure } from '../structure/FileStructure';

// Under test:
import { watchFileStructure } from './watch-file-structure';

describe('@tractor/file-structure - actions/watch-file-structure:', () => {
    it('should start watching the file structure', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let sockets = {
            emit: () => { }
        };
        let watcher = new EventEmitter();

        sinon.stub(fileStructure, 'watch').returns(watcher);
        sinon.stub(sockets, 'emit');
        sinon.spy(watcher, 'on');
        let timers = sinon.useFakeTimers();

        watchFileStructure(fileStructure, sockets);
        watcher.emit('change');
        timers.tick(100);

        expect(fileStructure.watch).to.have.been.called();
        expect(watcher.on).to.have.been.calledWith('change');
        expect(sockets.emit).to.have.been.calledWith('file-structure-change');

        fileStructure.watch.restore();
        timers.restore();
    });
});
