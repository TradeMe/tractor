/* global angular:true */

// Module:
import { MockRequestsModule } from './mock-requests.module';

// Dependencies:
import './mock-requests/mock-requests.component';
import './models/meta/mock-data-meta';
import './parsers/mock-data-parser.service';
import './mock-request-file-structure.service';

var tractor = angular.module('tractor');
tractor.requires.push(MockRequestsModule.name);

tractor.config((
    redirectionServiceProvider,
    $stateProvider
) => {
    redirectionServiceProvider.addFileType('.mock.json', 'mock-requests');

    $stateProvider
    .state('tractor.mock-requests', {
        url: 'mock-requests{file:TractorFile}',
        component: 'tractorMockRequests',
        resolve: {
            mockRequest ($stateParams, mockRequestFileStructureService, mockDataParserService) {
                let mockDataUrl = $stateParams.file && $stateParams.file.url;
                if (!mockDataUrl) {
                    return null;
                }
                return mockRequestFileStructureService.openItem(mockDataUrl)
                .then(mockRequestFile => mockDataParserService.parse(mockRequestFile));
            }
        }
    });
});
