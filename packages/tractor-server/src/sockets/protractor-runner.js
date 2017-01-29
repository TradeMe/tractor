// Utilities:
import Promise from 'bluebird';
import childProcess from 'child_process';
import path from 'path';

// Constants:
import config from '../config/config';
const PROTRACTOR_PATH = path.join('node_modules', 'protractor', 'bin', 'protractor');
const E2E_PATH = path.join(config.testDirectory, 'protractor.conf.js');

// Dependencies:
import stripcolorcodes from 'stripcolorcodes';

// Errors:
import { TractorError } from 'tractor-error-handler';

class ProtractorRunner {
    run (socket, runOptions) {
        if (module.exports.running) {
            console.error('Protractor already running.');
            return Promise.reject(new TractorError('Protractor already running.'));
        } else {
            module.exports.running = true;

            return Promise.resolve(config.beforeProtractor())
            .then(() => {
                console.info('Starting Protractor...\n');
                return startProtractor(socket, runOptions);
            })
            .catch((error) => {
                socket.lastMessage = socket.lastMessage || '';
                let [lastMessage] = socket.lastMessage.split(/\r\n|\n/);
                console.error(`${error.message}${lastMessage}`);
            })
            .finally(() => {
                socket.disconnect();
                return Promise.resolve(config.afterProtractor())
                .then(() => {
                    module.exports.running = false;
                    console.info('Protractor finished.');
                });
            });
        }
    }
}

function startProtractor (socket, options) {
    let protractorArgs = [PROTRACTOR_PATH, E2E_PATH];

    let { baseUrl, debug, feature, tag } = options;

    if (!baseUrl) {
        return Promise.reject(new TractorError('`baseUrl` must be defined.'));
    } else {
        protractorArgs = protractorArgs.concat(['--baseUrl', baseUrl]);
    }

    if (feature) {
        debug = !!debug;
    } else {
        feature = '*';
        debug = false;
    }

    let specsGlob = path.join(config.testDirectory, 'features', '**', `${feature}.feature`);

    protractorArgs = protractorArgs.concat(['--specs', specsGlob]);
    protractorArgs = protractorArgs.concat(['--params.debug', debug]);

    if (tag) {
        protractorArgs = protractorArgs.concat(['--cucumberOpts.tags', tag]);
        console.log(`Running cucumber with tag: ${tag}`);
     }

    let protractor = childProcess.spawn('node', protractorArgs);

    protractor.stdout.on('data', sendDataToClient.bind(socket));
    protractor.stderr.on('data', sendErrorToClient.bind(socket));
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
    this.lastMessage = data.toString();
    let messages = data.toString().split(/\r\n|\n/);
    messages.forEach((message) => {
        data = formatMessage(stripcolorcodes(message).trim());
        if (data && data.message.length) {
            this.emit('protractor-out', data);
        }
    });
}

function formatMessage (message) {
    // If it looks like an error:
    if (message.match(/Error\:/)) {
        return {
            message,
            type: 'error'
        };
    }

    // Remove line numbers from step definitions:
    message = message.replace(/\s*?# .*/g, '...');
    // Trim leading whitespace from scenario outlines:
    message = message.replace(/^\s*/gm, '');
    // Remove server URL:
    message = message.replace(/ at http.*/g, '.');
    // Really shitty match for some Error messages.
    // I'm not actually sure why these come back on stdout...?

    // If it's not something we care about, ignore it:
    if (!message.match(/^(Feature|Scenario|Given|Then|When)/)) {
        return null;
    }

    return {
        message,
        type: 'info'
    };
}

function sendErrorToClient () {
    this.emit('protractor-err', {
        message: 'Something went really wrong - check the console for details.',
        type: 'error'
    });
}

let protractorRunner = new ProtractorRunner();
export default protractorRunner;
