// Dependencies:
import { createDirIfMissing } from '@tractor/file-structure';
import path from 'path';

export async function init (config) {
    let { directory, reportsDirectory } = config.mochaSpecs;
    let cwd = process.cwd();
    let mochaSpecDirectoryPath = path.resolve(cwd, directory);
    let mochaReportsDirectoryPath = path.resolve(cwd, reportsDirectory);

    return Promise.all([
        createDirIfMissing(mochaSpecDirectoryPath),
        createDirIfMissing(mochaReportsDirectoryPath)
    ]);
}
