// Dependencies:
import { FileStructure, serveFileStructure } from '@tractor/file-structure';
import path from 'path';
import { MochaSpecFile } from './files/mocha-spec-file';

export function serve (config, di) {
    let mochaDirectoryPath = path.resolve(process.cwd(), config.mochaSpecs.directory);

    let mochaSpecsFileStructure = new FileStructure(mochaDirectoryPath, 'mocha-specs');
    mochaSpecsFileStructure.addFileType(MochaSpecFile);

    di.constant({ mochaSpecsFileStructure });
    di.call(serveFileStructure)(mochaSpecsFileStructure);
}
serve['@Inject'] = ['config', 'di'];
