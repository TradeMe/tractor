'use strict';

// Constants:
import { config } from '../config';
const PROTRACTOR_PATH = join('node_modules', 'protractor', 'bin', 'protractor');
const E2E_PATH = join(config.testDirectory, 'protractor.conf.js');

// Utilities:
import _ from 'lodash';
import Promise from 'bluebird';
import { spawn } from 'child_process';
import log from 'npmlog';
import { join } from 'path';

// Dependencies:
import stripcolorcodes from 'stripcolorcodes';

// Errors:
import TractorError from '../errors/TractorError';

export default { run };

function run (socket, runOptions) {
    if (module.exports.running) {
        log.error('Protractor already running.');
        return Promise.reject(new TractorError('Protractor already running.'));
    } else {
        module.exports.running = true;

        return Promise.resolve(config.beforeProtractor())
        .then(() => {
            log.info('Starting Protractor...\n');
            return startProtractor(socket, runOptions);
        })
        .catch((error) => {
            socket.lastMessage = socket.lastMessage || '';
            let [lastMessage] = socket.lastMessage.split(/\r\n|\n/);
            log.error(`${error.message}${lastMessage}`);
        })
        .finally(() => {
            socket.disconnect();
            return Promise.resolve(config.afterProtractor())
            .then(() => {
                module.exports.running = false;
                log.info('Protractor finished.');
            });
        });
    }
}

function startProtractor (socket, runOptions) {
    let featureToRun;
    let resolve;
    let reject;
    let deferred = new Promise((...args) => {
        resolve = args[0];
        reject = args[1];
    });

    if (_.isUndefined(runOptions.baseUrl)) {
        reject(new TractorError('`baseUrl` must be defined.'));
        return deferred;
    }
    
    if (runOptions.hasOwnProperty("feature")) {
        featureToRun = join(config.testDirectory,'/features','/**/',  runOptions.feature + '.feature')
    }else {
        featureToRun = join(config.testDirectory,'/features/**/*.feature');
    }
    
    let specs = featureToRun;

    let protractor = spawn('node', [PROTRACTOR_PATH, E2E_PATH, '--baseUrl', runOptions.baseUrl,'--specs',specs]);

    protractor.stdout.on('data', sendDataToClient.bind(socket));
    protractor.stderr.on('data', sendErrorToClient.bind(socket));
    protractor.stdout.pipe(process.stdout);
    protractor.stderr.pipe(process.stderr);

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
