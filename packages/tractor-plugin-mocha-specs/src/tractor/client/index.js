/* global angular:true */

// Module:
import { MochaSpecsModule } from './mocha-specs.module';

// Dependencies:
import './mocha-specs/mocha-specs.component';
import './mocha-specs-file-structure.service';
import './parsers/mocha-spec-parser.service';

let tractor = angular.module('tractor');
tractor.requires.push(MochaSpecsModule.name);

tractor.config((
    redirectionServiceProvider,
    $stateProvider
) => {
    redirectionServiceProvider.addFileType('.e2e-spec.js', 'mocha-specs');

    $stateProvider
    .state('tractor.mocha-specs', {
        url: 'mocha-specs{file:TractorFile}',
        component: 'tractorMochaSpecs',
        resolve: {
            availablePageObjects (pageObjectsService) {
                return pageObjectsService.getAvailablePageObjects()
                .then(availablePageObjects => [
                    ...availablePageObjects,
                    ...pageObjectsService.getPluginPageObjects()
                ]);
            },
            availableMockRequests ($injector) {
                if (!$injector.has('mockRequestFileStructureService')) {
                    return [];
                }
                let mockRequestFileStructureService = $injector.get('mockRequestFileStructureService');
                let MockDataMetaModel = $injector.get('MockDataMetaModel');
                return mockRequestFileStructureService.getFileStructure()
                .then(() => mockRequestFileStructureService.fileStructure.allFiles.filter(file => {
                    return file.extension === '.mock.json';
                })
                .map(file => new MockDataMetaModel(file)));
            },
            mochaSpec (
                $stateParams,
                availablePageObjects,
                availableMockRequests,
                mochaSpecsFileStructureService,
                mochaSpecParserService
            ) {
                let mochaUrl = $stateParams.file && $stateParams.file.url;
                if (!mochaUrl || mochaUrl === '/') {
                    return null;
                }
                return mochaSpecsFileStructureService.openItem(mochaUrl)
                .then(function (file) {
                    return mochaSpecParserService.parse(file, availablePageObjects, availableMockRequests);
                });
            }
        }
    });
});
