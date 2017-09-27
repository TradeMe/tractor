// Module:
import { MockRequestsModule } from './mock-requests.module';

// Dependencies:
import './mock-request';

function MockRequestParserService (
    MockRequest
) {
    return { parse };

    function parse (mockRequestFile) {
        let { basename, content } = mockRequestFile;
        try {
            var mockRequest = new MockRequest(content, {
                isSaved: true,
                file: mockRequestFile
            });
            mockRequest.name = basename;
            return mockRequest;
        } catch (e) {
            return new MockRequest();
        }
    }
}

MockRequestsModule.service('mockRequestParserService', MockRequestParserService);
