// Constants;
const GET_INSTALLED_DEPENDENCIES_COMMAND = 'npm ls --depth 0';
const INSTALL_DEPENDENCIES_COMMAND = 'npm install --save-dev --save-exact ';
const TO_INSTALL = [
    'bluebird@2.10.2',
    'chai@2.3.0',
    'chai-as-promised@5.1.0',
    'cucumber@1.3.1',
    'cucumber-html-reporter@0.3.5',
    'protractor@5.1.1',
    'protractor-cucumber-framework@0.6.0',
    'tractor-config-loader',
    'tractor-dependency-injection',
    'tractor-plugin-browser',
    'tractor-plugin-loader',
    'tractor-plugin-mock-requests'
];

// Utilities:
import Promise from 'bluebird';
import { error, info } from 'tractor-logger';

// Dependencies:
const childProcess = Promise.promisifyAll(require('child_process'));

export function installTractorDependenciesLocally () {
    return getInstalledDependencies()
    .then(installed => {
        let toInstall = filterAreadyInstalledDependencies(installed, TO_INSTALL);
        return installDependencies(toInstall);
    });
}

function getInstalledDependencies () {
    info('Checking installed npm dependencies...');

    let resolve;
    let deferred = new Promise((...args) => {
        [resolve] = args;
    });

    let ls = childProcess.exec(GET_INSTALLED_DEPENDENCIES_COMMAND);
    ls.stdout.on('data', data => {
        return resolve(data);
    });

    return deferred;
}

function filterAreadyInstalledDependencies (installed, dependencies) {
    return dependencies.filter(dependency => !new RegExp(dependency, 'gm').test(installed));
}

function installDependencies (modules) {
    if (modules.length) {
        info('Installing npm dependencies for tractor...');
    } else {
        info('All npm dependencies for tractor already installed.');
    }

    return Promise.all(modules.map(module => {
        info(`Installing "${module}"...`);
        return childProcess.execAsync(`${INSTALL_DEPENDENCIES_COMMAND}${module}`)
        .then(() => info(`Installed "${module}".`))
        .catch(() => error(`Couldn't install "${module}". Either run "tractor init" again, or install it manually by running "npm install ${module}"`));
    }));
}
