// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { readFiles } from '@tractor/file-structure';
import { MochaSpecFile } from '../tractor/server/files/mocha-spec-file';
import { MochaSpecFileRefactorer } from '../tractor/server/files/mocha-spec-file-refactorer';
import * as semver from 'semver';

// Versions:
const VERSIONS = ['1.4.0'];

export async function upgrade () {
    const config = getConfig();

    // Read all .e2e-spec.js files:
    let mochaSpecsFileStructure;
    try {
        mochaSpecsFileStructure = await readFiles(config.mochaSpecs.directory, [MochaSpecFile]);
    } catch {
        // Can't read .e2e-spec.js files, giving up.
        return;
    }
    const { allFiles } = mochaSpecsFileStructure.structure;

    if (config.cucumber && config.features && config.stepDefinitions) {
        await require('./cucumber-to-mocha').upgrade(config, mochaSpecsFileStructure);
        return;
    }

    return await allFiles.reduce(async (p, file) => {
        await p;
        const meta = await file.meta();
        if (!meta) {
            return;
        }

        let upgradeVersions = VERSIONS;
        const { version } = meta;
        if (version) {
            const closestVersion = VERSIONS.find(upgradeVersion => semver.gt(upgradeVersion, version));
            upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(closestVersion));
        }
        
        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            MochaSpecFileRefactorer[upgradeVersion] = require(`./${upgradeVersion}`).upgrade;
            await file.refactor(upgradeVersion);
            return file.refactor('versionChange', { version: upgradeVersion });
        }, null);
    }, null);
}
