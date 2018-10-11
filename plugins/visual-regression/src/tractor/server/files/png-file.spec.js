// Dependencies:
import path from 'path';
import { File, FileStructure } from '@tractor/file-structure';

// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { PNGFile } from './png-file';

describe('@tractor-plugins/visual-regression - png-file:', () => {
    describe('PNGFile constructor:', () => {
        it('should create a new PageObjectFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PNGFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(PNGFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PNGFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });

        it('should have an `extension` of ".vr.png"', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new PNGFile(filePath, fileStructure);

            expect(file.extension).to.equal('.vr.png');
        });
    });
});
