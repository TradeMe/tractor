// Dependencies:
import { FileStructure, serveFileStructure } from '@tractor/file-structure';
import path from 'path';
import { PageObjectFile } from './files/page-object-file';

export function serve (config, di) {
    let pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);

    let pageObjectsFileStructure = new FileStructure(pageObjectsDirectoryPath);
    pageObjectsFileStructure.addFileType(PageObjectFile);

    di.constant({ pageObjectsFileStructure });
    di.call(serveFileStructure)(pageObjectsFileStructure, 'page-objects');

    serveIncludes(config, di);
}
serve['@Inject'] = ['config', 'di'];

function serveIncludes (config, di) {
    let { include } = config.pageObjects;
    let includeFileStructures = Object.keys(include).map((includeName) => {
        let includePath = include[includeName];
        let includeDirectoryPath = path.resolve(process.cwd(), includePath);

        let includeFileStructure = new FileStructure(includeDirectoryPath);
        includeFileStructure.addFileType(PageObjectFile);

        di.call(serveFileStructure)(includeFileStructure, `page-objects/${includeName}`);

        return includeFileStructure;
    });
    di.constant({ includeFileStructures });
}
