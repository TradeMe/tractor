/* global angular:true */

// Module:
import { MockRequestsModule } from './mock-requests.module';

// Dependencies:
import './mock-requests/mock-requests.component';
import './models/meta/mock-data-meta';
import './parsers/mock-request-parser.service';
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
            mockRequest ($stateParams, mockRequestFileStructureService, mockRequestParserService) {
                let mockRequestUrl = $stateParams.file && $stateParams.file.url;
                if (!mockRequestUrl) {
                    return null;
                }
                return mockRequestFileStructureService.openItem(mockRequestUrl)
                .then(mockRequestFile => mockRequestParserService.parse(mockRequestFile));
            }
        }
    })
});
