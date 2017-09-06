// Utilities:
import path from 'path';
import { getConfig } from './utilities';

// Dependencies:
import { FileStructure, serveFileStructure } from 'tractor-file-structure';
import { PageObjectFile } from './files/page-object-file';

export default function serve (config, di) {
    config = getConfig(config);

    let { directory } = config;

    let pageObjects = path.resolve(process.cwd(), directory);
    let pageObjectsFileStructure = new FileStructure(pageObjects);
    di.constant({ pageObjectsFileStructure });
    pageObjectsFileStructure.addFileType(PageObjectFile);

    di.call(serveFileStructure)(pageObjectsFileStructure, 'page-objects');
}
serve['@Inject'] = ['config', 'di'];
