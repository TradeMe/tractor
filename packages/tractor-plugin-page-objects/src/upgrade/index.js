// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { FileStructure } from '@tractor/file-structure';
import path from 'path';
import { PageObjectFile } from '../tractor/server/files/page-object-file';
import { PageObjectFileRefactorer } from '../tractor/server/files/page-object-file-refactorer';

// Versions:
const VERSIONS = ['0.5.0'];

export async function upgrade () {
    let config = getConfig();
    let pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);
    let pageObjectsFileStructure = new FileStructure(pageObjectsDirectoryPath);
    pageObjectsFileStructure.addFileType(PageObjectFile);

    await pageObjectsFileStructure.read();

    let files = Object.keys(pageObjectsFileStructure.allFilesByPath)
    .filter(key => pageObjectsFileStructure.allFilesByPath[key] instanceof PageObjectFile)
    .map(key => pageObjectsFileStructure.allFilesByPath[key]);

    return await files.reduce(async (p, file) => {
        await p;
        let ast = file.ast;
        let [firstComment] = ast.comments;
        var meta = JSON.parse(firstComment.value);

        let version = meta.version;
        let upgradeVersions = VERSIONS.slice(VERSIONS.indexOf(version) + 1);

        return await upgradeVersions.reduce(async (p, upgradeVersion) => {
            await p;
            await require(`./${upgradeVersion}`).upgradeFile(file);
            return file.refactor('upgradeMetadataVersion', upgradeVersion);
        }, null);
    }, null);
}

PageObjectFileRefactorer.upgradeMetadataVersion = function upgradeMetadataVersion (file, upgradeVersion) {
    let { comments } = file.ast;
    let [comment] = comments;
    let metaData = JSON.parse(comment.value);
    metaData.version = upgradeVersion;
    comment.value = JSON.stringify(metaData);
};
