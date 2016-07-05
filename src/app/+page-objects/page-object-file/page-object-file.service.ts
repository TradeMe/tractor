'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Dependencies:
import { FileService } from '../../shared/file/file.service';
import { FileStructureService, FILE_STRUCTURE_PROVIDERS } from '../../shared/file-structure/file-structure.service';
import { PageObject } from '../page-object/page-object';
import { PageObjectParserService, PAGE_OBJECT_PARSER_PROVIDERS } from '../page-object/parser.service';

// Constants:
const TYPE = 'components';

@Injectable()
export class PageObjectFileService extends FileService<PageObject> {
    constructor (
        fileStructureService: FileStructureService,
        http: Http,
        pageObjectParserService: PageObjectParserService
    ) {
        super(http, pageObjectParserService, fileStructureService, TYPE);
    }
}

export const PAGE_OBJECT_FILE_PROVIDERS = [
    PageObjectFileService,
    FILE_STRUCTURE_PROVIDERS,
    PAGE_OBJECT_PARSER_PROVIDERS
];
