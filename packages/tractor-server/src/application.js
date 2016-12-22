// Constants:
import config from './config/config';

// Utilities:
import _ from 'lodash';
import fs from 'fs';
import log from 'npmlog';
import path from 'path';

// Dependencies:
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import io from 'socket.io';
import tractorFileStructure from 'tractor-file-structure';
import tractorPluginLoader from 'tractor-plugin-loader';

// Errors:
import { TractorError } from 'tractor-error-handler';

// Endpoints:
import getConfig from './api/get-config';
import getPlugins from './api/get-plugins';
import socketConnect from './sockets/connect';

// Files:
import './files/ComponentFile';
import './files/FeatureFile';
import './files/MockDataFile';
import './files/StepDefinitionFile';

let server;

export default { init, start };

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
    server = http.Server(application);
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
        dir = path.dirname(templatePath);
    } catch (e) {
        throw new TractorError('"tractor-client" is not installed.');
    }

    let renderIndex = injectPlugins(application, templatePath);

    application.get('/', renderIndex);

    application.use(express.static(dir));

    servePlugins(application);

    tractorFileStructure.serve(express, application, config);

    application.get('/config', getConfig.handler);
    application.get('/plugins', getPlugins.handler);

    application.get('*', renderIndex);

    sockets.of('/run-protractor')
    .on('connection', socketConnect);

    sockets.of('/server-status');
}

function initPlugins () {
    let plugins = tractorPluginLoader.getPlugins();
    plugins.forEach(plugin => plugin.init());
}

function injectPlugins (application, templatePath) {
    let plugins = tractorPluginLoader.getPlugins().filter(plugin => plugin.description.hasUI);

    plugins.forEach(plugin => application.use(express.static(path.dirname(plugin.script))));

    return (request, response) => {
        let template = _.template(fs.readFileSync(templatePath, 'utf8'));
        let scripts = plugins.map(plugin => path.basename(plugin.script));
        let rendered = template({ scripts });
        response.header('Content-Type', 'text/html');
        response.send(rendered);
    };
}

function servePlugins (application) {
    let plugins = tractorPluginLoader.getPlugins();
    plugins.forEach(plugin => plugin.serve(express, application));
}
