/* global describe:true, it:true */

// Test setup:
import { expect, sinon } from '../../test-setup';

// Dependencies:
import path from 'path';
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from './utilities';

// Under test:
import { createOpenItemHandler } from './open-item';

describe('@tractor/file-structure - actions/open-item:', () => {
    it('should open a file', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);
        let serialised = { };
        let request = {
            params: [file.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'serialise').returns(serialised)
        sinon.stub(response, 'send');

        let openItem = createOpenItemHandler(fileStructure);
        openItem(request, response);

        expect(File.prototype.serialise).to.have.been.called();
        expect(response.send).to.have.been.calledWith(serialised);

        File.prototype.serialise.restore();
    });

    it('should open a directory', () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let serialised = { };
        let request = {
            params: [directory.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(Directory.prototype, 'serialise').returns(serialised)
        sinon.stub(response, 'send');

        let openItem = createOpenItemHandler(fileStructure);
        openItem(request, response);

        expect(Directory.prototype.serialise).to.have.been.called();
        expect(response.send).to.have.been.calledWith(serialised);

        Directory.prototype.serialise.restore();
    });

    it(`should throw an error if it can't find the file to open`, () => {
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let request = {
            params: ['/directory/missing-item']
        };
        let response = {
            send: () => { }
        };

        sinon.stub(utilities, 'respondItemNotFound');

        let openItem = createOpenItemHandler(fileStructure);
        openItem(request, response);

        expect(utilities.respondItemNotFound).to.have.been.calledWith(path.join(path.sep, 'file-structure', 'directory', 'missing-item'), response);

        utilities.respondItemNotFound.restore();
    });
});
