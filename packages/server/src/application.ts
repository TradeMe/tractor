// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { info } from '@tractor/logger';
import { Tractor } from '@tractor/tractor';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import { Server } from 'http';
import template = require('lodash.template');
import { AddressInfo } from 'net';
import * as path from 'path';
import * as io from 'socket.io';
import terminalLink from 'terminal-link';

// Endpoints:
import { getConfigHandler } from './api/get-config';
import { getPluginsHandler } from './api/get-plugins';
import { runProtractorHandler } from './api/run-protractor';
import { searchHandler } from './api/search';

// Constants:
const PARAMETER_LIMIT = 50000;
const UPLOAD_SIZE_LIMIT = '50mb';

export async function start (tractor: Tractor, server: Server): Promise<void> {
    try {
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        await Promise.all(tractor.plugins.map(plugin => tractor.call(plugin.run)));
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        throw new TractorError('Could not run plugin.');
    }

    server.listen(tractor.config.port, () => {
        const link = terminalLink('tractor', `http://localhost:${(server.address() as AddressInfo).port}`, {
            fallback: (_, url): string => url
        });
        info(`tractor is running at ${link}`);
    });
}

export async function init (tractor: Tractor): Promise<Server> {
    const application = express();
    const server = new Server(application);
    const sockets = io(server);

    tractor.constant({ application, server, sockets });

    // Set some massive file size limit.
    application.use(bodyParser.json({
        limit: UPLOAD_SIZE_LIMIT
    }));
    application.use(bodyParser.urlencoded({
        extended: true,
        limit: UPLOAD_SIZE_LIMIT,
        parameterLimit: PARAMETER_LIMIT
    }));

    application.use(cors());

    let templatePath;
    let dir;
    try {
        templatePath = require.resolve('@tractor/ui');
        dir = path.dirname(templatePath);
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        throw new TractorError('"@tractor/ui" is not installed.');
    }

    const renderIndex = injectPlugins(tractor, application, templatePath);

    application.get('/', renderIndex);
    application.use(express.static(dir));

    application.get('/config', getConfigHandler(tractor));
    application.get('/plugins', getPluginsHandler(tractor));
    application.get('/search', searchHandler());

    sockets.of('/run-protractor')
    .on('connection', runProtractorHandler(tractor));

    sockets.of('/server-status');

    try {
        // HACK:
        // Here's another reason to kill the custom DI stuff:
        // tslint:disable-next-line:no-unbound-method
        await Promise.all(tractor.plugins.map(plugin => tractor.call(plugin.serve)));
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        throw new TractorError('Could not serve plugin.');
    }

    // Always make sure the '*' handler happens last:
    application.get('*', renderIndex);

    return server;
}

function injectPlugins (tractor: Tractor, application: express.Express, templatePath: string): express.RequestHandler {
    const pluginsWithUI = tractor.plugins.filter(plugin => plugin.description.hasUI);

    const UP_TO_NODE_MODULE = '../../../../';

    pluginsWithUI.forEach(plugin => {
        application.use(express.static(path.resolve(plugin.script!, UP_TO_NODE_MODULE)));
    });

    return (_: express.Request, response: express.Response): void => {
        const createTemplate = template(fs.readFileSync(templatePath, 'utf8'));
        const scripts = pluginsWithUI.map(plugin => {
            const nodeModuleDir = path.resolve(plugin.script!, UP_TO_NODE_MODULE);
            return plugin.script!.replace(nodeModuleDir, '');
        });
        const rendered = createTemplate({ scripts });
        response.header('Content-Type', 'text/html');
        response.send(rendered);
    };
}
