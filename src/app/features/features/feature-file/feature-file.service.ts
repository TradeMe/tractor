'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Dependencies:
import { Feature } from '../feature/feature';
import { FeatureParserService } from './parser.service';
import { FileService } from '../../../shared/file/file.service';
import { FileStructureService } from '../../../shared/file-structure/file-structure.service';

// Constants:
const TYPE = 'features';

@Injectable()
export class FeatureFileService extends FileService<Feature> {
    constructor (
        featureParserService: FeatureParserService,
        fileStructureService: FileStructureService,
        http: Http
    ) {
        super(http, featureParserService, fileStructureService, TYPE);
    }
}
