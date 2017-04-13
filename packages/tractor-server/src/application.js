// Utilities:
import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import { info } from 'tractor-logger';

// Dependencies:
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import template from 'lodash.template';
import io from 'socket.io';
import { serveFileStructure } from 'tractor-file-structure';

// Errors:
import { TractorError } from 'tractor-error-handler';

// Endpoints:
import { getConfigHandler } from './api/get-config';
import { getPluginsHandler } from './api/get-plugins';
import { socketHandler } from './sockets/connect';

// Files:
import './files/ComponentFile';
import './files/FeatureFile';
import './files/MockDataFile';
import './files/StepDefinitionFile';

let server;

export function start (config) {
    let tractor = server.listen(config.port, () => {
        info(`tractor is running at port ${tractor.address().port}`);
    });
}
start['@Inject'] = ['config'];

export function init (di, plugins) {
    let application = express();
    /* eslint-disable new-cap */
    server = http.Server(application);
    /* eslint-enable new-cap */
    let sockets = io(server);

    di.constant({ application, sockets });

    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
        extended: false
    }));

    application.use(cors());

    let templatePath;
    let dir;
    try {
        templatePath = require.resolve('tractor-client');
        dir = path.dirname(templatePath);
    } catch (e) {
        throw new TractorError('"tractor-client" is not installed.');
    }

    let renderIndex = injectPlugins(plugins, application, templatePath);

    application.get('/', renderIndex);

    application.use(express.static(dir));

    application.get('/config', di.call(getConfigHandler));
    application.get('/plugins', di.call(getPluginsHandler));

    sockets.of('/run-protractor')
    .on('connection', di.call(socketHandler));

    sockets.of('/server-status');

    return servePlugins(di, plugins)
    .then(() => {
        // Make sure the file structure handlers are added after the plugins:
        di.call(serveFileStructure);

        // Always make sure the '*' handler happens last:
        application.get('*', renderIndex);
    });
}
init['@Inject'] = ['di', 'plugins'];

function injectPlugins (plugins, application, templatePath) {
    plugins = plugins.filter(plugin => plugin.description.hasUI);

    const UP_TO_NODE_MODULE = '../../../../';

    plugins.forEach(plugin => {
        application.use(express.static(path.resolve(plugin.script, UP_TO_NODE_MODULE)))
    });

    return (request, response) => {
        let createTemplate = template(fs.readFileSync(templatePath, 'utf8'));
        let scripts = plugins.map(plugin => {
            let nodeModuleDir = path.resolve(plugin.script, UP_TO_NODE_MODULE);
            return plugin.script.replace(nodeModuleDir, '');
        });
        let rendered = createTemplate({ scripts });
        response.header('Content-Type', 'text/html');
        response.send(rendered);
    };
}

function servePlugins (di, plugins) {
    return Promise.map(plugins, plugin => di.call(plugin.serve));
}
