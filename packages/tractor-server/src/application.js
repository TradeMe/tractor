// Constants:
import config from './config/config';

// Utilities:
import _ from 'lodash';
import fs from 'fs';
import log from 'npmlog';
import { basename, dirname } from 'path';

// Dependencies:
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import io from 'socket.io';
import * as tractorPluginLoader from 'tractor-plugin-loader';

// Constants:
const OVERRIDE_METHODS = ['delete', 'get', 'post', 'push'];

// Errors:
import { TractorError } from 'tractor-error-handler';

// Endpoints:
import copyFile from './api/copy-file';
import createDirectory from './api/create-directory';
import deleteItem from './api/delete-item';
import editItemPath from './api/edit-item-path';
import getConfig from './api/get-config';
import getFileStructure from './api/get-file-structure';
import getPath from './api/get-path';
import getPlugins from './api/get-plugins';
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
    initPlugins();

    let application = express();
    /* eslint-disable new-cap */
    let server = http.Server(application);
    /* eslint-enable new-cap */
    let sockets = io(server);

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
        extended: false
    }));

    application.use(cors());

    let templatePath;
    let dir;
    try {
        templatePath = require.resolve('tractor-client');
        dir = dirname(templatePath);
    } catch (e) {
        throw new TractorError('"tractor-client" is not installed.');
    }

    let renderIndex = injectPlugins(application, templatePath);

    application.get('/', renderIndex);
    application.use(express.static(dir));

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
    application.get('/plugins', getPlugins.handler);

    addPluginEndpoints(application);

    application.get('*', renderIndex);

    sockets.of('/run-protractor')
    .on('connection', socketConnect);

    sockets.of('/server-status');

    return server;
}

function initPlugins () {
    let inits = tractorPluginLoader.getPluginInits();
    inits.forEach(init => init());
}

function injectPlugins (application, templatePath) {
    let plugins = tractorPluginLoader.getPlugins().filter(plugin => plugin.hasUI);

    plugins.forEach(plugin => application.use(express.static(dirname(plugin.script))));

    return (request, response) => {
        let template = _.template(fs.readFileSync(templatePath, 'utf8'));
        let scripts = plugins.map(plugin => basename(plugin.script));
        let rendered = template({ scripts });
        response.header('Content-Type', 'text/html');
        response.send(rendered);
    }
}

function addPluginEndpoints (application) {
    let plugins = tractorPluginLoader.getPlugins();

    plugins.forEach(plugin => {
        let { url } = plugin.description;

        let originals = OVERRIDE_METHODS.map(method => {
            let original = application[method];
            application[method] = ([...args]) => {
                let [path, ...callbacks] = args;
                path = `/${url}${path}`;
                return original.call(application, path, ...callbacks);
            }
            return original;
        });

        plugin.listen(application);

        OVERRIDE_METHODS.map((method, index) => {
            application.method = originals[index];
        });
    });
}
