// Module:
import { MockRequestsModule } from '../mock-requests.module';

// Dependencies:
import '../models/mock-data';
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
    MockDataModel
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
        MockDataModel,
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
