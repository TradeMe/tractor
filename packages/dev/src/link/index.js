// Dependencies:
const { exec } = require('child_process');
const { info, error } = require('@tractor/logger');

// Constants:
const PACKAGES = [
    '@tractor/cli',
    '@tractor/config-loader',
    '@tractor/core',
    '@tractor/dependency-injection',
    '@tractor/error-handler',
    '@tractor/file-javascript',
    '@tractor/file-structure',
    '@tractor/logger',
    '@tractor/plugin-loader',
    '@tractor/server',
    '@tractor/ui',
    '@tractor/unit-test',
];

export async function link (manager = 'npm') {
    info(`Linking dev dependencies using "${manager}...`);
    try {
        for (const name of PACKAGES) {
            await linkPackage(manager, name);
        }
        info('Linking complete!');
    } catch (e) {
        error(`Linking failed! Did you "${manager} link" the individual modules yet?`);
    }
}

function linkPackage (manager, name) {
    return new Promise((resolve, reject) => {
        exec(`${manager} link "${name}"`, (err, stdout, stderr) => {
            if (err) {
                error(`Linking "${name}" failed!`);
                // eslint-disable-next-line no-console
                console.log(stderr.toString().trim());
                reject(err);
            } else {
                info(`Linking "${name}" done!`);
                // eslint-disable-next-line no-console
                console.log(stdout.toString().trim());
                resolve();
            }
        });
    });
}
