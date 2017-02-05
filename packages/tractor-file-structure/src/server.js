// Constants:
import config from './config';

// Dependencies:
import { deleteItem } from './actions/delete-item';
import { moveItem } from './actions/move-item';
import { openItem } from './actions/open-item';
import { refactorItem } from './actions/refactor-item';
import { saveItem } from './actions/save-item';
import { watchFileStructure } from './actions/watch-file-structure';
import express from 'express';

export function serve (application, sockets) {
    application.use('/fs/static/', express.static(config.testDirectory));

    application.delete('/fs*', deleteItem);
    application.post('/fs/move*', moveItem);
    application.get('/fs*', openItem);
    application.post('/fs/refactor*', refactorItem);
    application.put('/fs*', saveItem);

    sockets.of('/watch-file-structure')
    .on('connection', watchFileStructure);
}
