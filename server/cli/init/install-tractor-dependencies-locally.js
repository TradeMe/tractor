'use strict';

// Utilities:
var constants = require('../../constants');
var log = require('../../utils/logging');
var Promise = require('bluebird');

// Dependencies:
var childProcess = require('child_process');

var TO_INSTALL = [
    'bluebird@2.3.11',
    'chai@1.10.0',
    'chai-as-promised@4.1.1',
    'cucumber@0.4.4',
    'git://github.com/phenomnomnominal/httpbackend',
    'protractor@1.4.0'
];

module.exports = {
    run: installTractorDependenciesLocally
};

function installTractorDependenciesLocally () {
    return getInstalledDependencies()
    .then(function (installed) {
        var toInstall = filterAreadyInstalledDependencies(installed, TO_INSTALL);
        return installDependencies(toInstall);
    });
}

function getInstalledDependencies () {
    log.info('Checking installed npm dependencies...');

    var lsResolve;
    var lsPromise = new Promise(function (resolve) {
        lsResolve = resolve;
    });

    var ls = childProcess.exec(constants.GET_INSTALLED_DEPENDENCIES_COMMAND);
    ls.stdout.on('data', function (data) {
        lsResolve(data);
    });

    return lsPromise;
}

function filterAreadyInstalledDependencies (installed, dependencies) {
    return dependencies.filter(function (dependency) {
        return !new RegExp(dependency, 'gm').test(installed);
    });
}

function installDependencies (modules) {
    if (modules.length) {
        log.info('Installing npm dependencies for tractor...');
    } else {
        log.info('All npm dependencies for tractor already installed.');
    }

    return Promise.all(modules.map(function (module) {
        log.info('Installing "' + module + '"...');
        return childProcess.execAsync(constants.INSTALL_DEPENDENCIES_COMMAND + module)
        .then(function () {
            log.success('Installed "' + module + '".');
        })
        .catch(function () {
            log.error('Couldn\'t install "' + module + '". Either run `tractor init` again, or install it manually by running "npm install ' + module + '"');
        });
    }));
}
