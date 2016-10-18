// Dependencies:
import { File } from 'tractor-file-structure';
import tractorFileStructure from 'tractor-file-structure';

export default class PNGFile extends File { }

PNGFile.extension = '.png';
PNGFile.type = 'visual-regression';

tractorFileStructure.registerFileType(PNGFile);
