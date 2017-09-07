'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Dependencies:
import { FileService } from '../../../shared/file/file.service';
import { FileStructureService } from '../../../shared/file-structure/file-structure.service';
import { StepDefinition } from '../step-definition/step-definition';
import { StepDefinitionParserService } from '../step-definition/parser.service';

// Constants:
const TYPE = 'step-definitions';

@Injectable()
export class StepDefinitionFileService extends FileService<StepDefinition> {
    constructor (
        fileStructureService: FileStructureService,
        http: Http,
        stepDefinitionParserService: StepDefinitionParserService
    ) {
        super(http, stepDefinitionParserService, fileStructureService, TYPE);
    }
}
