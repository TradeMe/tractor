// Constants;
const INSTALL_DEPENDENCIES_COMMAND = 'npm install --save-dev tractor@latest';
const LOCAL_TRACTOR_VERSION_COMMAND = 'npm --json list tractor';
const REMOTE_TRACTOR_VERSIONS_COMMAND = 'npm --json info tractor versions';

// Dependencies:
import Promise from 'bluebird';
import childProcess from 'child_process';
import { error, info } from '@tractor/logger';

export function installTractorLocally () {
    return Promise.all([
        getInstalledTractorVersion(),
        getRemoteTractorVersion()
    ])
    .spread((installed, remote) => {
        if (installed !== remote) {
            return installTractor();
        }
    });
}

function getInstalledTractorVersion () {
    info('Checking local "tractor" version...');
    return childProcess.execAsync(LOCAL_TRACTOR_VERSION_COMMAND)
    .then(local => {
        let { version } = JSON.parse(local).dependencies.tractor;
        info(`Local version of "tractor" is: ${version}`);
        return version;
    })
    .catch(() => {
        info('"tractor" is not installed.');
    });
}

function getRemoteTractorVersion () {
    info('Checking remote "tractor" version...');
    return childProcess.execAsync(REMOTE_TRACTOR_VERSIONS_COMMAND)
    .then(versions => {
        let [latest] = JSON.parse(versions).reverse();
        info(`Latest remote version of "tractor" is: ${latest}`);
        return latest;
    });
}

function installTractor () {
    info('Installing "tractor"...');
    return childProcess.execAsync(INSTALL_DEPENDENCIES_COMMAND)
    .catch(() => error(`Couldn't install "tractor". Either run "tractor init" again, or install it manually by running "npm install tractor@latest --save-dev"`))
    .then(() => info('Installed "tractor".'));
}
