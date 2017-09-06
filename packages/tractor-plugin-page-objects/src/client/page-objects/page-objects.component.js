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
        'page-objects',
        '.po.js'
    );
    controller.style = $sce.trustAsHtml(style.toString());

    return controller;
};

PageObjectsModule.component('tractorPageObjects', {
    controller: PageObjectsController,
    template
});
