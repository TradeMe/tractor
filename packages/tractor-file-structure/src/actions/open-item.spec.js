/* global describe:true, it:true */

// Utilities:
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import { Directory } from '../structure/Directory';
import { File } from '../structure/File';
import { FileStructure } from '../structure/FileStructure';
import * as utilities from '../utilities/utilities';

// Under test:
import { createOpenItemHandler } from './open-item';

describe('tractor-file-structure - actions/open-item:', () => {
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
        let request = {
            params: [directory.url]
        };
        let response = {
            send: () => { }
        };

        sinon.stub(response, 'send');

        let openItem = createOpenItemHandler(fileStructure);
        openItem(request, response);

        expect(response.send).to.have.been.calledWith(directory);
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
