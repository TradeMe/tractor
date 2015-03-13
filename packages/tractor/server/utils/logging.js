'use strict';

// Dependencies:
var chalk = require('chalk');

module.exports = {
    info: info,
    warn: warn,
    important: important,
    success: success,
    error: error
};

function log (message) {
    console.log(chalk.reset('[ tractor @ ' + new Date() + ' ]: ' + message));
}

function info (message) {
    log(' INFO: ' + chalk.white(message));
}

function warn (message) {
    log(chalk.bgYellow(' WARNING: ') + ' ' + chalk.yellow(message));
}

function important (message) {
    log(chalk.bgBlue(' IMPORTANT: ') + ' ' + chalk.blue(message));
}

function success (message) {
    log(chalk.bgGreen(' SUCCESS: ') + ' ' + chalk.green(message));
}

function error (message) {
    log(chalk.bgRed(' ERROR: ') + ' ' + chalk.red(message));
}
