'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Dependencies:
import { FileService } from '../../../shared/file/file.service';
import { FileStructureService } from '../../../shared/file-structure/file-structure.service';
import { PageObject } from '../page-object/page-object';
import { PageObjectParserService } from '../page-object/parser.service';

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
