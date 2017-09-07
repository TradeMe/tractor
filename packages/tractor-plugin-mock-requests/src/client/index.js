/* global angular:true */

// Module:
import { MockRequestsModule } from './mock-requests.module';

// Dependencies:
import './mock-requests/mock-requests.component';
import './mock-request-file-structure.service';
import './mock-request-parser.service';

var tractor = angular.module('tractor');
tractor.requires.push(MockRequestsModule.name);

tractor.config((
    $stateProvider
) => {
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
                .then(file => mockRequestParserService.parse(file));
            }
        }
    })
});
