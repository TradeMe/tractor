'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { FileEditorService } from '../../shared/file-editor/file-editor.service';
import { PageObject } from '../page-object/page-object';
import { PageObjectFileService, PAGE_OBJECT_FILE_PROVIDERS } from '../page-object-file/page-object-file.service';

@Injectable()
export class PageObjectFileEditorService extends FileEditorService<PageObject> {
    constructor (
        pageObjectFileService: PageObjectFileService
    ) {
        super(pageObjectFileService);
    }
}

export const PAGE_OBJECT_FILE_EDITOR_PROVIDERS = [
    PageObjectFileEditorService,
    PAGE_OBJECT_FILE_PROVIDERS
];
