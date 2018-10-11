// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { File, FileStructure } from '@tractor/file-structure';
import path from 'path';

// Under test:
import { MockRequestFile } from './mock-request-file';

describe('@tractor-plugins/mock-requests - mock-request-file:', () => {
    describe('MockRequestFile constructor:', () => {
        it('should create a new MockRequestFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockRequestFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(MockRequestFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new MockRequestFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('MockRequestFile.serialise:', () => {
        it(`should include the file's content`, () => {
            let content = 'content';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.mock.json');

            sinon.stub(File.prototype, 'serialise').returns({});

            let file = new MockRequestFile(filePath, fileStructure);
            file.content = content;

            file.serialise();

            expect(file.content).to.equal(content);

            File.prototype.serialise.restore();
        });
    });
});
