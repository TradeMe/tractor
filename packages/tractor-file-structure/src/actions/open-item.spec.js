/* global describe:true, it:true */

// Constants:
import CONSTANTS from '../constants';
import config from '../config';

// Utilities:
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import Directory from '../structure/Directory';
import File from '../structure/File';
import { fileStructure } from '../file-structure';
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

// Under test:
import { openItem } from './open-item';

describe('tractor-file-structure - actions/open-item:', () => {
    it('should open a file', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();
        config.testDirectory = '/';

        let file = new File(path.join(path.sep, 'file-structure', 'file.ext'), fileStructure);
        let serialised = { };
        let request = {
            url: `/fs${file.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(File.prototype, 'serialise').returns(serialised)
        sinon.stub(response, 'send');

        openItem(request, response);

        expect(File.prototype.serialise).to.have.been.called();
        expect(response.send).to.have.been.calledWith(serialised);

        File.prototype.serialise.restore();
    });

    it('should open a directory', () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();
        config.testDirectory = '/';

        let directory = new Directory(path.join(path.sep, 'file-structure', 'directory'), fileStructure);
        let request = {
            url: `/fs${directory.url}`
        };
        let response = {
            send: () => { }
        };

        sinon.stub(response, 'send');

        openItem(request, response);

        expect(response.send).to.have.been.calledWith(directory);
    });

    it(`should throw an error if it can't find the file to open`, () => {
        fileStructure.path = path.join(path.sep, 'file-structure');
        fileStructure.init();
        config.testDirectory = '/';

        let request = {
            url: '/fs/directory/missing-item'
        };
        let response = {
            send: () => { }
        };

        sinon.stub(tractorErrorHandler, 'handle');

        openItem(request, response);

        expect(tractorErrorHandler.handle).to.have.been.calledWith(response, new TractorError(`Could not find "${path.join(path.sep, 'file-structure', 'directory', 'missing-item')}"`, CONSTANTS.ITEM_NOT_FOUND_ERROR));

        tractorErrorHandler.handle.restore();
    });
});
