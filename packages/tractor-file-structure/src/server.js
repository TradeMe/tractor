// Dependencies:
import express from 'express';

// Actions:
import { createDeleteItemHandler } from './actions/delete-item';
import { createMoveItemHandler } from './actions/move-item';
import { createOpenItemHandler } from './actions/open-item';
import { createRefactorItemHandler } from './actions/refactor-item';
import { createSaveItemHandler } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';

export function serveFileStructure (application, di, fileStructure, sockets) {
    application.use('/fs/static/', express.static(fileStructure.path));

    application.delete('/fs*', di.call(createDeleteItemHandler));
    application.post('/fs/move*', di.call(createMoveItemHandler));
    application.get('/fs*', di.call(createOpenItemHandler));
    application.post('/fs/refactor*', di.call(createRefactorItemHandler));
    application.put('/fs*', di.call(createSaveItemHandler));

    di.call(watchFileStructure, [sockets.of('/watch-file-structure')]);
}
serveFileStructure['@Inject'] = ['application', 'di', 'fileStructure', 'sockets'];
