'use strict';

// Constants;
import constants from '../../constants';
const TO_INSTALL = [
    'bluebird@2.10.2',
    'chai@2.3.0',
    'chai-as-promised@5.1.0',
    'cucumber@0.7.0',
    'httpbackend@1.2.1',
    'protractor@2.5.1'
];

// Utilities:
import log from 'npmlog';
import Promise from 'bluebird';

// Dependencies:
const childProcess = Promise.promisifyAll(require('child_process'));

export default {
    run: installTractorDependenciesLocally
};

function installTractorDependenciesLocally () {
    return getInstalledDependencies()
    .then((installed) => {
        let toInstall = filterAreadyInstalledDependencies(installed, TO_INSTALL);
        return installDependencies(toInstall);
    });
}

function getInstalledDependencies () {
    log.info('Checking installed npm dependencies...');

    let resolve;
    let deferred = new Promise((...args) => {
        resolve = args[0];
    });

    let ls = childProcess.exec(constants.GET_INSTALLED_DEPENDENCIES_COMMAND);
    ls.stdout.on('data', data => resolve(data));

    return deferred;
}

function filterAreadyInstalledDependencies (installed, dependencies) {
    return dependencies.filter((dependency) => !new RegExp(dependency, 'gm').test(installed));
}

function installDependencies (modules) {
    if (modules.length) {
        log.info('Installing npm dependencies for tractor...');
    } else {
        log.info('All npm dependencies for tractor already installed.');
    }

    return Promise.all(modules.map((module) => {
        log.info(`Installing "${module}"...`);
        return childProcess.execAsync(`${constants.INSTALL_DEPENDENCIES_COMMAND}${module}`)
        .then(() => log.verbose(`Installed "${module}".`))
        .catch(() => log.error(`Couldn't install "${module}". Either run "tractor init" again, or install it manually by running "npm install ${module}"`));
    }));
}
