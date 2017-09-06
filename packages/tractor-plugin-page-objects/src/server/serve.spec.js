/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, sinon } from '../../tests/setup';

// Dependencies:
import { FileStructure } from 'tractor-file-structure';
import { PageObjectFile } from './files/page-object-file';

// Under test:
import serve from './serve';

describe('tractor-plugin-page-objects - serve:', () => {
    it('should create a new FileStructure', () => {
        let pageObjectsFileStructure = null;
        let config = {};
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                pageObjectsFileStructure = constants.pageObjectsFileStructure;
            }
        });

        serve(config, di);

        expect(pageObjectsFileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should default to using the default directory', () => {
        let pageObjectsFileStructure = null;
        let config = {};
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                pageObjectsFileStructure = constants.pageObjectsFileStructure;
            }
        });

        sinon.stub(process, 'cwd').returns('/');

        serve(config, di);

        expect(pageObjectsFileStructure.path).to.equal('/tractor/page-objects');

        process.cwd.restore();
    });

    it('should let you override the directory from config', () => {
        let pageObjectsFileStructure = null;
        let config = {
            pageObjects: {
                directory: './my/page-objects/directory'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                pageObjectsFileStructure = constants.pageObjectsFileStructure;
            }
        });

        sinon.stub(process, 'cwd').returns('/');

        serve(config, di);

        expect(pageObjectsFileStructure.path).to.equal('/my/page-objects/directory');

        process.cwd.restore();
    });

    it('should add the FileStructure to the DI container', () => {
        let config = {}
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        serve(config, di);

        expect(di.constant).to.have.been.called();
    });

    it('should add the PageObjectFile type to the FileStructure', () => {
        let config = {};
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(PageObjectFile);
    });
});
