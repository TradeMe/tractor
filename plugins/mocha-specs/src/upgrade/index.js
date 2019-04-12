// Dependencies:
import { readFiles } from '@tractor/file-structure';
import { MochaSpecFile } from '../tractor/server/files/mocha-spec-file';
import { MochaSpecFileRefactorer } from '../tractor/server/files/mocha-spec-file-refactorer';

// Versions:
const VERSIONS = [];

export async function upgrade (tractor) {
    const config = tractor.config;

    // Read all .e2e-spec.js files:
    const mochaSpecsFileStructure = await readFiles(config.mochaSpecs.directory, [MochaSpecFile]);
    const { allFiles } = mochaSpecsFileStructure.structure;

    if (config.cucumber && config.features && config.stepDefinitions) {
        await require('./cucumber-to-mocha').upgrade(config, mochaSpecsFileStructure);
        return;
    }

    return await allFiles.reduce(async (p, file) => {
        await p;
        const { version } = await file.meta();
        const upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(version) + 1);

        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            MochaSpecFileRefactorer[upgradeVersion] = require(`./${upgradeVersion}`).upgrade;
            await file.refactor(upgradeVersion);
            return file.refactor('versionChange', { version: upgradeVersion });
        }, null);
    }, null);
}
