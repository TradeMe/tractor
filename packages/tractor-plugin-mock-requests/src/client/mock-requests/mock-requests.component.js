// Module:
import { MockRequestsModule } from '../mock-requests.module';

// Dependencies:
import '../mock-request';
import '../mock-request-file-structure.service';

// Template:
import template from './mock-requests.component.html';

// Styles:
import style from './mock-requests.component.css';

function MockRequestsController (
    $sce,
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileEditorControllerFactory,
    mockRequestFileStructureService,
    persistentStateService,
    notifierService,
    MockRequest
) {
    let { mockRequest } = $scope.$parent.$resolve;
    let controller = new fileEditorControllerFactory(
        $scope,
        $window,
        $state,
        confirmDialogService,
        mockRequestFileStructureService,
        persistentStateService,
        notifierService,
        MockRequest,
        mockRequest,
        'mock-requests',
        '.mock.json'
    );
    controller.style = $sce.trustAsHtml(style.toString());
    return controller;
}

MockRequestsModule.component('tractorMockRequests', {
    controller: MockRequestsController,
    template
});
