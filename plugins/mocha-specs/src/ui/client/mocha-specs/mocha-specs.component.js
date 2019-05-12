// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Template:
import template from './mocha-specs.component.html';

// Styles:
import style from './mocha-specs.component.css';

function MochaSpecsController (
    $sce,
    $scope,
    $state,
    $window,
    confirmDialogService,
    fileEditorControllerFactory,
    mochaSpecsFileStructureService,
    persistentStateService,
    notifierService,
    runnerService,
    MochaSpecModel
) {
    let { availablePageObjects, availableMockRequests, mochaSpec } = $scope.$parent.$resolve;
    var controller = fileEditorControllerFactory(
        $scope,
        $window,
        $state,
        confirmDialogService,
        mochaSpecsFileStructureService,
        persistentStateService,
        notifierService,
        MochaSpecModel,
        mochaSpec,
        '.e2e-spec.js'
    );

    controller.style = $sce.trustAsHtml(style.toString());

    controller.fileStyle = function () {
        return {
            'file-tree__item--mocha-spec': true
        };
    };

    controller.fileModel.availablePageObjects = availablePageObjects;
    controller.fileModel.availableMockRequests = availableMockRequests;

    controller.debug = false;
    controller.saveAndRunSpec = saveAndRunSpec.bind(controller);

    function saveAndRunSpec (specPath) {
        if (!this.showErrors()) {
            return;
        }
        this.saveFile()
        .then(function () {
            if (specPath) {
                runnerService.runProtractor({
                    params: {
                        spec: specPath,
                        debug: this.debug
                    }
                });
            }
        }.bind(this));
    }

    return controller;
}

MochaSpecsModule.component('tractorMochaSpecs', {
    controller: MochaSpecsController,
    template
});
