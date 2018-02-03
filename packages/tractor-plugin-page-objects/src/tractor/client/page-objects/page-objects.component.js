// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../page-objects-file-structure.service';

// Template:
import template from './page-objects.component.html';

// Styles:
import style from './page-objects.component.css';

function  PageObjectsController (
    $sce,
    $scope,
    $window,
    $state,
    confirmDialogService,
    fileEditorControllerFactory,
    pageObjectFileStructureService,
    persistentStateService,
    notifierService,
    PageObjectModel
) {
    let { pageObject } = $scope.$parent.$resolve;

    let controller = new fileEditorControllerFactory(
        $scope,
        $window,
        $state,
        confirmDialogService,
        pageObjectFileStructureService,
        persistentStateService,
        notifierService,
        PageObjectModel,
        pageObject,
        '.po.js'
    );
    // LOL, fix this:
    controller.fileModel.availablePageObjects = $scope.$parent.$resolve.availablePageObjects;

    controller.style = $sce.trustAsHtml(style.toString());

    controller.fileStyle = function (item) {
        return {
            'file-tree__item--page-object': true,
            'file-tree--item--unused': item.referencedBy.length === 0
        };
    };

    controller.getAllVariableNames = function  (pageObject, currentObject) {
        return [pageObject].concat(pageObject.elements, pageObject.actions)
        .filter(object => object !== currentObject)
        .map(object => object.variableName)
        .filter(Boolean);
    };
    controller.getAllParameterNames = function (action, currentParameter) {
        return action.parameters.filter(parameter => parameter !== currentParameter)
        .map(parameter => parameter.variableName)
        .filter(Boolean);
    }

    return controller;
}

PageObjectsModule.component('tractorPageObjects', {
    controller: PageObjectsController,
    template
});
