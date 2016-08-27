'use strict';

// Angular:
import { OnDestroy, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs/rx';

// Dependencies:
import { ConfirmService } from '../confirm/confirm.service';
import { Directory } from '../file-structure/directory.interface';
import { Factory } from '../factory/factory.interface';
import { FileService } from '../file/file.service';
import { FileStructure } from '../file-structure/file-structure.interface';
import { FileStructureItem } from '../file-structure/file-structure-item.interface';
import { FileStructureService } from '../file-structure/file-structure.service';
import { NotifierService } from '../../home/notifier/notifier.service';

export class FileEditorController<T extends FileStructureItem> implements OnDestroy, OnInit {
    public directory: Directory;

    private confirmOverwrite: Subject<boolean>;
    private onFileStructureChange: Subscription;

    constructor (
        protected confirmService: ConfirmService,
        protected fileFactory: Factory<T>,
        protected fileService: FileService<T>,
        protected fileStructureService: FileStructureService,
        protected notifierService: NotifierService,
        protected router: Router
    ) { }

    public ngOnInit (): void {
        this.onFileStructureChange = this.fileStructureService.fileStructureChange$.subscribe((fileStructure: FileStructure) => {
            this.directory = fileStructure.directory;
        });
        this.fileService.getFileStructure();
    }

    public ngOnDestroy (): void {
        this.onFileStructureChange.unsubscribe();
    }

    public saveFile (file: T): Observable<Response> {
        let { data, name } = file;
        let path = null;

        return this.fileService.getPath(name, file.path)
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
        .flatMap(() => this.fileService.saveFile({ data, path }));
    }
}
