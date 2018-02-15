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

        var mockRequest = new MockDataModel(mockRequestFile);
        mockRequest.name = basename;
        mockRequest.json = content;
        return mockRequest;
    }
}

MockRequestsModule.service('mockRequestParserService', MockRequestParserService);
