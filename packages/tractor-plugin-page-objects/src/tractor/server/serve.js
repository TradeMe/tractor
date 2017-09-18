// Dependencies:
import path from 'path';
import { FileStructure, serveFileStructure } from 'tractor-file-structure';
import { PageObjectFile } from './files/page-object-file';

export function serve (config, di) {
    let pageObjectsDirectoryPath = path.resolve(process.cwd(), config.pageObjects.directory);

    let pageObjectsFileStructure = new FileStructure(pageObjectsDirectoryPath);
    pageObjectsFileStructure.addFileType(PageObjectFile);

    di.constant({ pageObjectsFileStructure });
    di.call(serveFileStructure)(pageObjectsFileStructure, 'page-objects');
}
serve['@Inject'] = ['config', 'di'];
