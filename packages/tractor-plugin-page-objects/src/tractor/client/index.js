/* global angular:true */

// Module:
import { PageObjectsModule } from './page-objects.module';

// Dependencies:
import './models/meta/page-object-meta';
import './page-objects/page-objects.component';
import './parsers/page-object-parser.service';
import './page-objects-file-structure.service';

var tractor = angular.module('tractor');
tractor.requires.push(PageObjectsModule.name);

tractor.config((
    redirectionServiceProvider,
    $stateProvider
) => {
    redirectionServiceProvider.addFileType('.po.js', 'page-objects');

    $stateProvider
    .state('tractor.page-objects', {
        url: 'page-objects{file:TractorFile}',
        component: 'tractorPageObjects',
        resolve: {
            availablePageObjects ($injector) {
                if (!$injector.has('pageObjectFileStructureService')) {
                    return [];
                }
                let pageObjectFileStructureService = $injector.get('pageObjectFileStructureService');
                let PageObjectMetaModel = $injector.get('PageObjectMetaModel');
                return pageObjectFileStructureService.getFileStructure()
                .then(() => pageObjectFileStructureService.fileStructure.allFiles.filter(file => {
                    return file.extension === '.po.js';
                })
                .map(file => new PageObjectMetaModel(file)));
            },
            pageObject ($stateParams, pageObjectFileStructureService, pageObjectParserService, availablePageObjects) {
                var pageObjectUrl = $stateParams.file && $stateParams.file.url;
                if (!pageObjectUrl) {
                    return null;
                }
                return pageObjectFileStructureService.openItem(pageObjectUrl)
                .then(pageObjectFile => pageObjectParserService.parse(pageObjectFile, availablePageObjects));
            }
        }
    })
});
