// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { readFiles } from '@tractor/file-structure';
import { MochaSpecFile } from '../../../mocha-specs/dist/tractor/server/files/mocha-spec-file';
import { PageObjectFile } from '../tractor/server/files/page-object-file';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';
import * as semver from 'semver';

// Versions:
const VERSIONS = ['0.5.0', '0.5.2', '0.6.0', '0.7.0', '1.4.0', '1.7.0', '1.9.0'];

export async function upgrade () {
    const config = getConfig();

    // Read all .e2e-spec.js files:
    let pageObjectsFileStructure;
    try {
        pageObjectsFileStructure = await readFiles(config.pageObjects.directory, [PageObjectFile]);
        let mochaSpecsFileStructure = await readFiles(config.mochaSpecs.directory, [MochaSpecFile]);
        pageObjectsFileStructure.referenceManager.addFileStructure(mochaSpecsFileStructure);
        await mochaSpecsFileStructure.read();
    } catch {
        // Can't read .po.js files, giving up.
        return;
    }
    const { allFiles } = pageObjectsFileStructure.structure;

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
            PageObjectFileRefactorer[upgradeVersion] = require(`./${upgradeVersion}`).upgrade;
            await file.refactor(upgradeVersion);
            if (upgradeVersion === '1.9.0') {
                return;
            }
            return file.refactor('versionChange', { version: upgradeVersion });
        }, Promise.resolve());
    }, Promise.resolve());
}
