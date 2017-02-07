// Dependencies:
import express from 'express';

// Actions:
import { createDeleteItemHandler } from './actions/delete-item';
import { createMoveItemHandler } from './actions/move-item';
import { createOpenItemHandler } from './actions/open-item';
import { createRefactorItemHandler } from './actions/refactor-item';
import { createSaveItemHandler } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';

export function serve (application, sockets, fileStructure) {
    application.use('/fs/static/', express.static(fileStructure.path));

    application.delete('/fs*', createDeleteItemHandler(fileStructure));
    application.post('/fs/move*', createMoveItemHandler(fileStructure));
    application.get('/fs*', createOpenItemHandler(fileStructure));
    application.post('/fs/refactor*', createRefactorItemHandler(fileStructure));
    application.put('/fs*', createSaveItemHandler(fileStructure));

    watchFileStructure(fileStructure, sockets.of('/watch-file-structure'));
}
