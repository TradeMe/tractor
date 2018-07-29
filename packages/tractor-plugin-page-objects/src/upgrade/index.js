// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { FileStructure } from '@tractor/file-structure';
import path from 'path';
import { PageObjectFile } from '../tractor/server/files/page-object-file';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';
import { getMeta, getMetaToken } from './get-meta';

// Versions:
const VERSIONS = ['0.5.0', '0.5.2'];

export async function upgrade () {
    const config = getConfig();
    const pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);
    const pageObjectsFileStructure = new FileStructure(pageObjectsDirectoryPath);
    pageObjectsFileStructure.addFileType(PageObjectFile);

    await pageObjectsFileStructure.read();

    const files = Object.keys(pageObjectsFileStructure.allFilesByPath)
    .filter(key => pageObjectsFileStructure.allFilesByPath[key] instanceof PageObjectFile)
    .map(key => pageObjectsFileStructure.allFilesByPath[key]);

    return await files.reduce(async (p, file) => {
        await p;
        const { version } = getMeta(file);
        const upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(version) + 1);

        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            await require(`./${upgradeVersion}`).upgradeFile(file);
            return file.refactor('upgradeMetadataVersion', upgradeVersion);
        }, null);
    }, null);
}

PageObjectFileRefactorer.upgradeMetadataVersion = function upgradeMetadataVersion (file, upgradeVersion) {
    const metaToken = getMetaToken(file);
    const metaData = JSON.parse(metaToken.value);
    metaData.version = upgradeVersion;
    metaToken.value = JSON.stringify(metaData);
};
