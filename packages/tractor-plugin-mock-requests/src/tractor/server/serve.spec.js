/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, sinon } from '@tractor/unit-test';

// Dependencies:
import { FileStructure } from '@tractor/file-structure';
import { MockRequestFile } from './files/mock-request-file';

// Under test:
import { serve } from './serve';

describe('@tractor-plugins/mock-requests - serve:', () => {
    it('should create a new FileStructure', () => {
        let mockRequestsFileStructure = null;
        let config = {
            mockRequests: {
                directory: './tractor/mock-requests'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                mockRequestsFileStructure = constants.mockRequestsFileStructure;
            }
        });

        serve(config, di);

        expect(mockRequestsFileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should add the FileStructure to the DI container', () => {
        let config = {
            mockRequests: {
                directory: './tractor/mock-requests'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        serve(config, di);

        expect(di.constant).to.have.been.called();
    });

    it('should add the MockRequestFile type to the FileStructure', () => {
        let config = {
            mockRequests: {
                directory: './tractor/mock-requests'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(MockRequestFile);
    });
});
