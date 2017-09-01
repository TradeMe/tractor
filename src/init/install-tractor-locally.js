// Constants;
const INSTALL_DEPENDENCIES_COMMAND = 'npm install --save-dev ';
const TRACTOR_LATEST = 'tractor@latest';

// Utilities:
import Promise from 'bluebird';
import { error, info } from 'tractor-logger';

// Dependencies:
const childProcess = Promise.promisifyAll(require('child_process'));

export function installTractorLocally () {
    return installDependency(TRACTOR_LATEST)
}

function installDependency (module) {
    info(`Installing "${module}"...`);
    return childProcess.execAsync(`${INSTALL_DEPENDENCIES_COMMAND}${module}`)
    .then(() => info(`Installed "${module}".`))
    .catch(() => error(`Couldn't install "${module}". Either run "tractor init" again, or install it manually by running "npm install ${module} --save-dev"`));
}
