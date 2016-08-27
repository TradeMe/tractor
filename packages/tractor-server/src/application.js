'use strict';

// Constants:
import { config } from './config';

// Utilities:
import log from 'npmlog';
import { join, resolve } from 'path';

// Dependencies:
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import io from 'socket.io';

// Endpoints:
import copyFile from './api/copy-file';
import createDirectory from './api/create-directory';
import deleteItem from './api/delete-item';
import editItemPath from './api/edit-item-path';
import getConfig from './api/get-config';
import getFileStructure from './api/get-file-structure';
import getPath from './api/get-path';
import openFile from './api/open-file';
import saveFile from './api/save-file';
import socketConnect from './sockets/connect';

let server = init();

export default {
    start
};

function start () {
    log.verbose('Starting tractor... brrrrrrmmmmmmm');

    let tractor = server.listen(config.port, () => {
        log.info(`tractor is running at port ${tractor.address().port}`);
    });
}

function init () {
    let application = express();
    /* eslint-disable new-cap */
    let server = http.Server(application);
    /* eslint-enable new-cap */
    let sockets = io(server);

    application.use(express.static(resolve(__dirname, '../www')));

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
        extended: false
    }));

    application.use(cors());

    application.get('/:type/file-structure', getFileStructure.handler);

    application.post('/:type/directory', createDirectory.handler);
    application.patch('/:type/directory/path', editItemPath.handler);
    application.delete('/:type/directory', deleteItem.handler);

    application.get('/:type/file', openFile.handler);
    application.put('/:type/file', saveFile.handler);
    application.get('/:type/file/path', getPath.handler);
    application.patch('/:type/file/path', editItemPath.handler);
    application.post('/:type/file/copy', copyFile.handler);
    application.delete('/:type/file', deleteItem.handler);

    application.get('/config', getConfig.handler);

    application.get('*', (request, response) => {
        response.sendFile(join(__dirname, '../www', 'index.html'));
    });

    sockets.of('/run-protractor')
    .on('connection', socketConnect);

    sockets.of('/server-status');

    return server;
}
