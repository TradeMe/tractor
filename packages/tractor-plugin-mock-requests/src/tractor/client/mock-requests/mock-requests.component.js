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
        '.mock.json'
    );

    controller.style = $sce.trustAsHtml(style.toString());

    controller.fileStyle = function (item) {
        return {
            'file-tree__item--mock-request': true,
            'file-tree--item--unused': item.referencedBy.length === 0
        };
    };

    return controller;
}

MockRequestsModule.component('tractorMockRequests', {
    controller: MockRequestsController,
    template
});
