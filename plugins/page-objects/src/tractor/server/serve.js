// Dependencies:
import { FileStructure, serveFileStructure } from '@tractor/file-structure';
import { PageObjectFile } from './files/page-object-file';

export function serve (config, di) {
    let pageObjectsFileStructure = new FileStructure(config.pageObjects.directory, 'page-objects');
    pageObjectsFileStructure.addFileType(PageObjectFile);

    di.constant({ pageObjectsFileStructure });
    di.call(serveFileStructure)(pageObjectsFileStructure);

    serveIncludes(config, di);
}
serve['@Inject'] = ['config', 'di'];

function serveIncludes (config, di) {
    let { include } = config.pageObjects;
    let includeFileStructures = Object.keys(include).map((includeName) => {
        let includeFileStructure = new FileStructure(include[includeName], `included-page-objects/${includeName}`);
        includeFileStructure.addFileType(PageObjectFile);

        di.call(serveFileStructure)(includeFileStructure);

        return includeFileStructure;
    });
    di.constant({ includeFileStructures });
}
