'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependencies:
import { ConfirmService } from '../../shared/confirm/confirm.service';
import { Feature, FeatureFactory } from './feature/feature';
import { FeatureFileService } from './feature-file/feature-file.service';
import { FileEditorController } from '../../shared/file-editor/file-editor.controller';
import { FileStructureService } from '../../shared/file-structure/file-structure.service';
import { NotifierService } from '../../home/notifier/notifier.service';

@Component({
    selector: 'tractor-features',
    templateUrl: 'features.component.html'
})
export class FeaturesComponent extends FileEditorController<Feature> implements OnInit {
    public feature: Feature;

    private name: string;

    constructor (
        private route: ActivatedRoute,
        confirmService: ConfirmService,
        fileFactory: FeatureFactory,
        fileService: FeatureFileService,
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
                .subscribe((feature: Feature) => this.feature = feature);
            } else {
                this.newFile();
            }
        });
    }

    public newFile () {
        if (this.feature) {
            return this.router.navigate(['/features']);
        }
        this.feature = this.fileFactory.create();
    }

    public trySave (file: Feature) {
        super.saveFile(file)
        .subscribe(() => {
            this.router.navigate(['/features', file.name]);
        }, () => {
            this.notifierService.error('Feature was not saved.');
        });
    }
}
