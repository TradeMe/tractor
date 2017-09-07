'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { MockData, MockDataFactory } from '../mock-data/mock-data';
import { Parser } from '../../../shared/parser/parser.interface';

@Injectable()
export class MockDataParserService implements Parser<MockData> {
    constructor (
        private mockDataFactory: MockDataFactory
    ) { }

    public parse (mockDataFile): MockData {
        try {
            let { content, path } = mockDataFile;
            let mockDataModel = this.mockDataFactory.create(content, {
                isSaved: true,
                path
            });

            this.parseMockData(mockDataModel, mockDataFile);

            return mockDataModel;
        } catch (e) {
            console.warn('Invalid mock data:', mockDataFile.content);
            return null;
        }
    }

    private parseMockData (mockDataModel: MockData, mockDataFile) {
        let { name } = mockDataFile;
        mockDataModel.name = name;
        assert(mockDataModel.name);
    }
}
