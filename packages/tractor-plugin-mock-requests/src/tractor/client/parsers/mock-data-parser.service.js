// Module:
import { MockRequestsModule } from '../mock-requests.module';

// Dependencies:
import '../models/mock-data';

function MockDataParserService (
    MockDataModel
) {
    return { parse };

    function parse (mockDataFile) {
        let { basename, content } = mockDataFile;

        let mockData = new MockDataModel(mockDataFile);
        mockData.name = basename;
        mockData.json = content;
        return mockData;
    }
}

MockRequestsModule.service('mockDataParserService', MockDataParserService);
