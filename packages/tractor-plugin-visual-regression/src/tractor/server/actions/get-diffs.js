// Dependencies:
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';

// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY } from '../constants';

export function createGetDiffsHandler (fileStructure) {
    let { allFilesByPath, structure } = fileStructure;

    return function getDiffs (request, response) {
        let diffFiles = structure.allFiles.filter(file => file.extension === DiffPNGFile.prototype.extension);
        let diffs = diffFiles.map(diffFile => {
            let baselineFile = allFilesByPath[getBaselinePath(diffFile)];
            let changesFile = allFilesByPath[getChangesPath(diffFile)];
            if (baselineFile && changesFile) {
                return {
                    name: diffFile.basename,
                    baseline: baselineFile,
                    changes: changesFile,
                    diff: diffFile
                };
            }
        })
        .filter(Boolean);
        response.json({ diffs });
    }
}

function getBaselinePath (diffFile) {
    return replaceExtension(diffFile.path.replace(DIFFS_DIRECTORY, BASELINE_DIRECTORY));
}

function getChangesPath (diffFile) {
    return replaceExtension(diffFile.path.replace(DIFFS_DIRECTORY, CHANGES_DIRECTORY));
}

function replaceExtension (filePath) {
    return filePath.replace(DiffPNGFile.prototype.extension, PNGFile.prototype.extension);
}
