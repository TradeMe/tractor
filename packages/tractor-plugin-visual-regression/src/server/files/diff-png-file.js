// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';

export class DiffPNGFile extends File { }

DiffPNGFile.prototype.extension = '.vrdiff.png';
DiffPNGFile.prototype.type = 'visual-regression-diff';

tractorFileStructure.registerFileType(DiffPNGFile);
