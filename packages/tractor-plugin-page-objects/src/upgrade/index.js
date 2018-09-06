// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { readFiles } from '@tractor/file-structure';
import { PageObjectFile } from '../tractor/server/files/page-object-file';

// Versions:
const VERSIONS = ['0.5.0', '0.5.2'];

export async function upgrade () {
    const config = getConfig();

    // Read all .e2e-spec.js files:
    const pageObjectsFileStructure = await readFiles(config.pageObjects.directory, [PageObjectFile]);
    const { allFiles } = pageObjectsFileStructure.structure;

    return await allFiles.reduce(async (p, file) => {
        await p;
        const { version } = await file.meta();
        const upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(version) + 1);

        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            await require(`./${upgradeVersion}`).upgradeFile(file);
            return file.refactor('versionChange', { version: upgradeVersion });
        }, null);
    }, null);
}
