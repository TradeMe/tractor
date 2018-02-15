/* global describe:true, it:true, xit:true */

// Test setup:
import { expect, sinon } from '@tractor/unit-test';

// Dependencies:
import { File, FileStructure } from '@tractor/file-structure';
import path from 'path';

// Under test:
import { searchHandler } from './search';

describe('@tractor/server - api: search', () => {
    it('should respond with no results initially', () => {
        let request = {};
        let response = {
            send: () => {}
        };

        sinon.stub(response, 'send');

        searchHandler()(request, response);

        expect(response.send).to.have.been.calledWith({
            results: []
        });
    });

    // TODO: These tests are impossible to right because of the current DI setup...
    // debounce needs to be an injectable thing.
    xit('should return search results after some Files hav been processed', () => {
        let request = {
            query: 'file'
        };
        let response = {
            send: () => {}
        };
        let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
        let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');
        let file = new File(filePath, fileStructure);

        sinon.stub(File.prototype, 'read').resolves(null);
        sinon.stub(response, 'send');

        let handler = searchHandler();

        return file.read()
        .then(() => {
            handler(request, response);
            expect(response.send).to.have.been.calledWith({
                results: [file.toJSON()]
            });

            File.prototype.read.restore();
        });
    });

    it('should reindex whenever a File is saved');

    it('should reindex whenever a File is deleted');
});
