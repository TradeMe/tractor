// Dependencies:
import { File } from 'tractor-file-structure';
import { registerFileType } from 'tractor-file-structure';

export class PNGFile extends File { }

PNGFile.prototype.extension = '.vr.png';
PNGFile.prototype.type = 'visual-regression';

registerFileType(PNGFile);
