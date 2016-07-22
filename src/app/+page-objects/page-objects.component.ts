'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependencies:
import { ButtonComponent } from '../shared/button/button.component';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmService, CONFIRM_PROVIDERS } from '../shared/confirm/confirm.service';
import { FileEditorComponent } from '../shared/file-editor/file-editor.component';
import { FileEditorController } from '../shared/file-editor/file-editor.controller';
import { FileStructureService } from '../shared/file-structure/file-structure.service';
import { FileTreeComponent } from '../shared/file-tree/file-tree.component';
import { InputComponent } from '../shared/input/input.component';
import { PageObject, PageObjectFactory } from './page-object/page-object';
import { PageObjectFileService, PAGE_OBJECT_FILE_PROVIDERS } from './page-object-file/page-object-file.service';

@Component({
    moduleId: module.id,
    selector: 'tractor-page-objects',
    templateUrl: 'page-objects.component.html',
    styleUrls: ['page-objects.component.css'],
    directives: [ButtonComponent, ConfirmComponent, FileEditorComponent, FileTreeComponent, InputComponent],
    providers: [CONFIRM_PROVIDERS, PAGE_OBJECT_FILE_PROVIDERS]
})
export class PageObjectsComponent extends FileEditorController<PageObject> implements OnInit {
    private name: string;
    private pageObject: PageObject;

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        confirmService: ConfirmService,
        fileStructureService: FileStructureService,
        pageObjectFactory: PageObjectFactory,
        pageObjectFileService: PageObjectFileService
    ) {
        super(confirmService, fileStructureService, pageObjectFactory, pageObjectFileService);
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
}
