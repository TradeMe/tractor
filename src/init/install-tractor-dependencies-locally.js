// Constants;
const GET_INSTALLED_DEPENDENCIES_COMMAND = 'npm ls --depth 0';
const INSTALL_DEPENDENCIES_COMMAND = 'npm install --save-dev --save-exact ';
const TO_INSTALL = [
    'bluebird@2.10.2',
    'chai@2.3.0',
    'chai-as-promised@5.1.0',
    'cucumber@1.3.1',
    'cucumber-html-reporter@0.3.5',
    'httpbackend@1.2.1',
    'protractor@4.0.11',
    'protractor-cucumber-framework@0.6.0',
    'tractor-plugin-browser@0.1.0',
    'tractor-plugin-loader@0.1.1'
];

// Utilities:
import Promise from 'bluebird';

// Dependencies:
const childProcess = Promise.promisifyAll(require('child_process'));

export default {
    run: installTractorDependenciesLocally
};

function installTractorDependenciesLocally () {
    return getInstalledDependencies()
    .then(installed => {
        let toInstall = filterAreadyInstalledDependencies(installed, TO_INSTALL);
        return installDependencies(toInstall);
    });
}

function getInstalledDependencies () {
    console.info('Checking installed npm dependencies...');

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
        console.info('Installing npm dependencies for tractor...');
    } else {
        console.info('All npm dependencies for tractor already installed.');
    }

    return Promise.all(modules.map(module => {
        console.info(`Installing "${module}"...`);
        return childProcess.execAsync(`${INSTALL_DEPENDENCIES_COMMAND}${module}`)
        .then(() => console.log(`Installed "${module}".`))
        .catch(() => console.error(`Couldn't install "${module}". Either run "tractor init" again, or install it manually by running "npm install ${module}"`));
    }));
}
