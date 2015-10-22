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

    application.get('/:type/file-structure', require('./api/get-file-structure').handler);

    application.post('/:type/directory', require('./api/create-directory').handler);
    application.patch('/:type/directory/path', require('./api/edit-item-path').handler);
    application.delete('/:type/directory', require('./api/delete-item').handler);

    application.get('/:type/file', require('./api/open-file').handler);
    application.put('/:type/file', require('./api/save-file').handler);
    application.get('/:type/file/path', require('./api/get-path').handler);
    application.patch('/:type/file/path', require('./api/edit-item-path').handler);
    application.post('/:type/file/copy', require('./api/copy-file').handler);
    application.delete('/:type/file', require('./api/delete-item').handler);

    application.get('/config', require('./api/get-config').handler);

    application.get('*', (request, response) => {
        response.sendFile(join(__dirname, '../www', 'index.html'));
    });

    sockets.of('/run-protractor')
    .on('connection', require('./sockets/connect'));

    sockets.of('/server-status');

    return server;
}
