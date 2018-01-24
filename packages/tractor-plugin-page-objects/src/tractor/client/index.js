/* global angular:true */

// Module:
import { PageObjectsModule } from './page-objects.module';

// Dependencies:
import './models/meta/page-object-meta';
import './page-objects/page-objects.component';
import './parsers/page-object-parser.service';
import './page-objects-file-structure.service';
import './page-objects.service';

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
            availablePageObjects (pageObjectsService) {
                return pageObjectsService.getAvailablePageObjects();
            },
            pageObject ($stateParams, pageObjectFileStructureService, pageObjectParserService, availablePageObjects) {
                let pageObjectUrl = $stateParams.file && $stateParams.file.url;
                if (!pageObjectUrl) {
                    return null;
                }
                return pageObjectFileStructureService.openItem(pageObjectUrl)
                .then(pageObjectFile => pageObjectParserService.parse(pageObjectFile, availablePageObjects));
            }
        }
    })
});
