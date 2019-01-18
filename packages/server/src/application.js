// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info } from '@tractor/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import template from 'lodash.template';
import path from 'path';
import io from 'socket.io';
import terminalLink from 'terminal-link';

// Endpoints:
import { getConfigHandler } from './api/get-config';
import { getPluginsHandler } from './api/get-plugins';
import { searchHandler } from './api/search';
import { socketHandler } from './sockets/connect';

// Constants:
const PARAMETER_LIMIT = 50000;
const UPLOAD_SIZE_LIMIT = '50mb';

let server;

export async function start (config, di, plugins) {
    await Promise.all(plugins.map(plugin => di.call(plugin.run)));
    let tractor = server.listen(config.port, () => {
        const link = terminalLink('tractor', `http://localhost:${tractor.address().port}`, {
            fallback: (_, url) => url
        });
        info(`tractor is running at ${link}`);
    });
}
start['@Inject'] = ['config', 'di', 'plugins'];

export async function init (di, plugins) {
    let application = express();
    /* eslint-disable new-cap */
    server = http.Server(application);
    /* eslint-enable new-cap */
    let sockets = io(server);

    di.constant({ application, sockets });

    // Set some massive file size limit.
    application.use(bodyParser.json({
        limit: UPLOAD_SIZE_LIMIT
    }));
    application.use(bodyParser.urlencoded({
        limit: UPLOAD_SIZE_LIMIT,
        extended: true,
        parameterLimit: PARAMETER_LIMIT
    }));

    application.use(cors());

    let templatePath;
    let dir;
    try {
        templatePath = require.resolve('@tractor/ui');
        dir = path.dirname(templatePath);
    } catch (e) {
        throw new TractorError('"@tractor/ui" is not installed.');
    }

    let renderIndex = injectPlugins(plugins, application, templatePath);

    application.get('/', renderIndex);
    application.use(express.static(dir));

    application.get('/config', di.call(getConfigHandler));
    application.get('/plugins', di.call(getPluginsHandler));
    application.get('/search', di.call(searchHandler));

    sockets.of('/run-protractor')
    .on('connection', di.call(socketHandler));

    sockets.of('/server-status');

    await Promise.all(plugins.map(plugin => di.call(plugin.serve)));

    // Always make sure the '*' handler happens last:
    application.get('*', renderIndex);
}
init['@Inject'] = ['di', 'plugins'];

function injectPlugins (plugins, application, templatePath) {
    plugins = plugins.filter(plugin => plugin.description.hasUI);

    const UP_TO_NODE_MODULE = '../../../../';

    plugins.forEach(plugin => {
        application.use(express.static(path.resolve(plugin.script, UP_TO_NODE_MODULE)));
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
