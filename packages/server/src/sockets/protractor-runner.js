// Utilities:
import childProcess from 'child_process';
import path from 'path';
import which from 'npm-which';
import { error, info } from '@tractor/logger';

// Constants:
const PROTRACTOR_CONFIG_FILE = 'protractor.conf.js';
const PROTRACTOR_PATH = which(process.cwd()).sync('protractor');
const ENABLE_DEBUGGER = '--inspect-brk';
const NODE_COMMAND = 'node';

// Errors:
import { TractorError } from '@tractor/error-handler';

export async function run (config, socket, runOptions) {
    if (module.exports.running) {
        info('Protractor already running.');
        throw new TractorError('Protractor already running.');
    } else {
        module.exports.running = true;

        try {
            await config.beforeProtractor();
            info('Starting Protractor...');
            await startProtractor(config, socket, runOptions);    
        } catch (e) {
            socket.lastMessage = socket.lastMessage || '';
            let [lastMessage] = socket.lastMessage.split(/\r\n|\n/);
            error(`${e.message}${lastMessage}`);
        } finally {
            socket.disconnect();
            await config.afterProtractor();
            module.exports.running = false;
            info('Protractor finished.');
        }
    }
}

async function startProtractor (config, socket, options) {
    const { baseUrl, params } = options;
    if (!baseUrl) {
        throw new TractorError('`baseUrl` must be defined.');
    }

    const protractorConfigPath = path.join(config.directory, PROTRACTOR_CONFIG_FILE);
    const protractorArgs = [PROTRACTOR_PATH, protractorConfigPath].concat(toArgs(options));
    if (params && params.debug) {
        protractorArgs.unshift(ENABLE_DEBUGGER);
    }

    const protractor = childProcess.spawn(NODE_COMMAND, protractorArgs);

    protractor.stdout.on('data', sendDataToClient.bind(socket));
    protractor.stderr.on('data', sendDataToClient.bind(socket));
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);

    let resolve, reject;
    const deferred = new Promise((...args) => [resolve, reject] = args);

    protractor.on('error', error => reject(new TractorError(error.message)));
    protractor.on('exit', (code) => {
        if (code) {
            reject(new TractorError('Protractor Exit Error - '));
        } else {
            resolve();
        }
    });
    return deferred;
}

function toArgs (params, parent = '') {
    let args = [];
    Object.keys(params).forEach(param => {
        const value = params[param];
        if (typeof value === 'object') {
            args = args.concat(toArgs(value, parent ? `${parent}.${param}.` : `${param}.`));
        } else {
            args = args.concat([`--${parent}${param}`, value]);
        }
    });
    return args;
}

function sendDataToClient (data) {
    this.emit('protractor-out', data.toString());
}
