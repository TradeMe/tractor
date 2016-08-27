'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependencies:
import { ConfirmService } from '../../shared/confirm/confirm.service';
import { FileEditorController } from '../../shared/file-editor/file-editor.controller';
import { FileStructureService } from '../../shared/file-structure/file-structure.service';
import { NotifierService } from '../../home/notifier/notifier.service';
import { StepDefinition, StepDefinitionFactory } from './step-definition/step-definition';
import { StepDefinitionFileService } from './step-definition-file/step-definition-file.service';

@Component({
    selector: 'tractor-step-definitions',
    templateUrl: 'step-definitions.component.html'
})
export class StepDefinitionsComponent extends FileEditorController<StepDefinition> implements OnInit {
    private name: string;
    private stepDefinition: StepDefinition;

    constructor (
        private route: ActivatedRoute,
        confirmService: ConfirmService,
        fileFactory: StepDefinitionFactory,
        fileService: StepDefinitionFileService,
        fileStructureService: FileStructureService,
        notifierService: NotifierService,
        router: Router
    ) {
        super(confirmService, fileFactory, fileService, fileStructureService, notifierService, router);
    }

    public ngOnInit (): void {
        super.ngOnInit();
        this.route.params.subscribe(params => {
            this.name = params['name'];

            if (this.name) {
                this.fileService.getFileStructure()
                .flatMap(() => this.fileService.getPath(this.name))
                .flatMap((path: string) => this.fileService.openFile(path))
                .subscribe((stepDefinition: StepDefinition) => this.stepDefinition = stepDefinition);
            } else {
                this.newFile();
            }
        });
    }

    public newFile () {
        if (this.stepDefinition) {
            return this.router.navigate(['/step-definitions']);
        }
        this.stepDefinition = this.fileFactory.create();
    }

    public trySave (file: StepDefinition) {
        super.saveFile(file)
        .subscribe(() => {
            this.router.navigate(['/step-definitions', file.name]);
        }, () => {
            this.notifierService.error('Step definition was not saved.');
        });
    }
}
