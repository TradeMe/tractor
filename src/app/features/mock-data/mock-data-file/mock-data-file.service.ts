'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Dependencies:
import { FileService } from '../../../shared/file/file.service';
import { FileStructureService } from '../../../shared/file-structure/file-structure.service';
import { MockData } from '../mock-data/mock-data';
import { MockDataParserService } from '../mock-data/parser.service';

// Constants:
const TYPE = 'mock-data';

@Injectable()
export class MockDataFileService extends FileService<MockData> {
    constructor (
        featureParserService: MockDataParserService,
        fileStructureService: FileStructureService,
        http: Http
    ) {
        super(http, featureParserService, fileStructureService, TYPE);
    }
}
