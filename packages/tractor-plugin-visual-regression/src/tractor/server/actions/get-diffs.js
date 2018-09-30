// Dependencies:
import path from 'path';
import { DiffPNGFile } from '../files/diff-png-file';
import { PNGFile } from '../files/png-file';

// Constants:
import { BASELINE_DIRECTORY, CHANGES_DIRECTORY, DIFFS_DIRECTORY } from '../constants';

export function createGetDiffsHandler (fileStructure) {
    const { allFilesByPath, structure } = fileStructure;

    return function getDiffs (request, response) {
        const diffFiles = structure.allFiles.filter(file => file.extension === DiffPNGFile.prototype.extension);

        const diffs = diffFiles.map(diff => {
            const name = diff.path.replace(path.join(structure.path, DIFFS_DIRECTORY), '');
            const baseline = allFilesByPath[getBaselinePath(diff)];
            const changes = allFilesByPath[getChangesPath(diff)];
            if (baseline && changes) {
                return { name, baseline, changes, diff };
            }
        })
        .filter(Boolean);
        response.json({ diffs });
    };
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
