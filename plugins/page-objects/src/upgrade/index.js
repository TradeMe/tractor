// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { readFiles } from '@tractor/file-structure';
import { PageObjectFile } from '../tractor/server/files/page-object-file';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';

// Versions:
const VERSIONS = ['0.5.0', '0.5.2', '0.6.0', '0.7.0', '1.4.0', '1.7.0'];

export async function upgrade () {
    const config = getConfig();

    // Read all .e2e-spec.js files:
    let pageObjectsFileStructure;
    try {
        pageObjectsFileStructure = await readFiles(config.pageObjects.directory, [PageObjectFile]);
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
        const { version } = meta;
        const upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(version) + 1);

        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            PageObjectFileRefactorer[upgradeVersion] = require(`./${upgradeVersion}`).upgrade;
            await file.refactor(upgradeVersion);
            return file.refactor('versionChange', { version: upgradeVersion });
        }, null);
    }, null);
}
