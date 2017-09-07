'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependencies:
import { ConfirmService } from '../../shared/confirm/confirm.service';
import { FileEditorController } from '../../shared/file-editor/file-editor.controller';
import { FileStructureService } from '../../shared/file-structure/file-structure.service';
import { NotifierService } from '../../home/notifier/notifier.service';
import { PageObject, PageObjectFactory } from './page-object/page-object';
import { PageObjectFileService } from './page-object-file/page-object-file.service';

@Component({
    selector: 'tractor-page-objects',
    templateUrl: 'page-objects.component.html'
})
export class PageObjectsComponent extends FileEditorController<PageObject> implements OnInit {
    public pageObject: PageObject;

    private name: string;

    constructor (
        private route: ActivatedRoute,
        confirmService: ConfirmService,
        fileFactory: PageObjectFactory,
        fileService: PageObjectFileService,
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
                .subscribe((pageObject: PageObject) => this.pageObject = pageObject);
            } else {
                this.newFile();
            }
        });
    }

    public newFile () {
        if (this.pageObject) {
            return this.router.navigate(['/page-objects']);
        }
        this.pageObject = this.fileFactory.create();
    }

    public trySave (file: PageObject) {
        super.saveFile(file)
        .subscribe(() => {
            this.router.navigate(['/page-objects', file.name]);
        }, () => {
            this.notifierService.error('Page object was not saved.');
        });
    }
}
