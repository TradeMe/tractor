// Dependencies:
import express from 'express';

// Actions:
import { createDeleteItemHandler } from './actions/delete-item';
import { createMoveItemHandler } from './actions/move-item';
import { createOpenItemHandler } from './actions/open-item';
import { createRefactorItemHandler } from './actions/refactor-item';
import { createSaveItemHandler } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';

export function serveFileStructure (application, sockets) {
    return function (fileStructure, prefix) {
        application.use(`/${prefix}/fs/static/`, express.static(fileStructure.path));

        application.delete(`/${prefix}/fs*`, createDeleteItemHandler(fileStructure));
        application.post(`/${prefix}/fs/move*`, createMoveItemHandler(fileStructure));
        application.get(`/${prefix}/fs*`, createOpenItemHandler(fileStructure));
        application.post(`/${prefix}/fs/refactor*`, createRefactorItemHandler(fileStructure));
        application.put(`/${prefix}/fs*`, createSaveItemHandler(fileStructure));

        watchFileStructure(fileStructure, sockets.of('/watch-file-structure'));
    }
}
serveFileStructure['@Inject'] = ['application', 'sockets'];
