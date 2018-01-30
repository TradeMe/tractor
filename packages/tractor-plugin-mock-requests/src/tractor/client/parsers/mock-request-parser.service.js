// Module:
import { MockRequestsModule } from '../mock-requests.module';

// Dependencies:
import '../models/mock-data';

function MockRequestParserService (
    MockDataModel
) {
    return { parse };

    function parse (mockRequestFile) {
        let { basename, content } = mockRequestFile;
        try {
            var mockRequest = new MockDataModel(content, {
                isSaved: true,
                file: mockRequestFile
            });
            mockRequest.name = basename;
            return mockRequest;
        } catch (e) {
            return new MockDataModel();
        }
    }
}

MockRequestsModule.service('mockRequestParserService', MockRequestParserService);
