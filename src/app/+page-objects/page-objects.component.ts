'use strict';

// Angular:
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnActivate, RouteSegment, RouteTree, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs/rx';

// Dependencies:
import { ButtonComponent } from '../shared/button/button.component';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmService, CONFIRM_PROVIDERS } from '../shared/confirm/confirm.service';
import { Directory } from '../shared/file-structure/directory.interface';
import { FileEditorComponent } from '../shared/file-editor/file-editor.component';
import { FileStructure } from '../shared/file-structure/file-structure.interface';
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
export class PageObjectsComponent implements OnActivate, OnDestroy, OnInit {
    private confirmOverwrite: Subject<boolean>;
    private directory: Directory;
    private name: string;
    private onFileStructureChange: Subscription;
    private pageObject: PageObject;

    constructor (
        private confirmService: ConfirmService,
        private fileStructureService: FileStructureService,
        private pageObjectFactory: PageObjectFactory,
        private pageObjectFileService: PageObjectFileService,
        private router: Router
    ) {
    }

    public ngOnInit (): void {
        this.onFileStructureChange = this.fileStructureService.fileStructureChange$.subscribe((fileStructure: FileStructure) => {
            this.directory = fileStructure.directory;
        });
        this.pageObjectFileService.getFileStructure();
    }

    public ngOnDestroy (): void {
        this.onFileStructureChange.unsubscribe();
    }

    public routerOnActivate (current: RouteSegment) {
        this.name = current.getParam('name');

        if (this.name) {
            this.pageObjectFileService.getFileStructure()
            .flatMap(() => this.pageObjectFileService.getPath(this.name))
            .flatMap((path: string) => this.pageObjectFileService.openFile(path))
            .subscribe((pageObject: PageObject) => this.pageObject = pageObject);
        } else {
            this.pageObject = this.pageObjectFactory.create();
        }
    }

    public newFile () {
        if (this.pageObject) {
            return this.router.navigate(['/page-objects']);
        }
        this.pageObject = this.pageObjectFactory.create();
    }

    public saveFile () {
        let path = null;
        let { data, name } = this.pageObject;

        this.pageObjectFileService.getPath(name, this.pageObject.path)
        .flatMap((filePath: string) => {
            path = filePath;
            let exists = this.fileStructureService.checkFileExists(path);

            if (exists) {
                this.confirmOverwrite = this.confirmService.show();
                this.confirmOverwrite.subscribe(() => {
                    this.confirmOverwrite = null;
                });
                return this.confirmOverwrite;
            } else {
                return Observable.of(true);
            }
        })
        .filter((value: boolean) => value)
        .flatMap(() => this.pageObjectFileService.saveFile({ data, path }))
        .subscribe();
        //
        // .then(() => this.fileService.getFileStructure())
        // .then(fileStructure => {
        //     this.fileStructure = fileStructure;
        //     return this.fileService.openFile({ path }, this.availableComponents, this.availableMockData)
        // })
        // .then(file => this.fileModel = file)
        // .catch(() => {
        //     // this.notifierService.error('File was not saved.');
        // });
    }
}
