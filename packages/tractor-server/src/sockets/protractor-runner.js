// Utilities:
import childProcess from 'child_process';
import path from 'path';
import { error, info } from '@tractor/logger';

// Constants:
const PROTRACTOR_PATH = path.join('node_modules', 'protractor', 'bin', 'protractor');

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

    let protractorConfigPath = path.join(config.directory, 'protractor.conf.js');
    let protractorArgs = [PROTRACTOR_PATH, protractorConfigPath];

    let { baseUrl, debug, feature, tag } = options;

async function startProtractor (config, socket, options) {
    if (!baseUrl) {
        throw new TractorError('`baseUrl` must be defined.');
    }

    if (feature) {
        debug = !!debug;
    } else {
        feature = '*';
        debug = false;
    }

    let specsGlob = path.join(config.directory, 'features', '**', `${feature}.feature`);

    protractorArgs = protractorArgs.concat(['--specs', specsGlob]);
    protractorArgs = protractorArgs.concat(['--params.debug', debug]);

    if (tag) {
        protractorArgs = protractorArgs.concat(['--cucumberOpts.tags', tag]);
        info(`Running cucumber with tag: ${tag}`);
     }

    let protractor = childProcess.spawn('node', protractorArgs);

    protractor.stdout.on('data', sendDataToClient.bind(socket));
    protractor.stderr.on('data', sendDataToClient.bind(socket));
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);

    let resolve, reject;
    let deferred = new Promise((...args) => [resolve, reject] = args);

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

function sendDataToClient (data) {
    this.emit('protractor-out', data.toString());
}
