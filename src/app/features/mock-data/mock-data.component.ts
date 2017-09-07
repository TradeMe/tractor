'use strict';

// Angular:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependencies:
import { ConfirmService } from '../../shared/confirm/confirm.service';
import { FileEditorController } from '../../shared/file-editor/file-editor.controller';
import { FileStructureService } from '../../shared/file-structure/file-structure.service';
import { MockData, MockDataFactory } from './mock-data/mock-data';
import { MockDataFileService } from './mock-data-file/mock-data-file.service';
import { NotifierService } from '../../home/notifier/notifier.service';

@Component({
    selector: 'tractor-mock-data',
    templateUrl: 'mock-data.component.html'
})
export class MockDataComponent extends FileEditorController<MockData> implements OnInit {
    public mockData: MockData;

    private name: string;

    constructor (
        private route: ActivatedRoute,
        confirmService: ConfirmService,
        fileFactory: MockDataFactory,
        fileService: MockDataFileService,
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
                .subscribe((mockData: MockData) => this.mockData = mockData);
            } else {
                this.newFile();
            }
        });
    }

    public newFile () {
        if (this.mockData) {
            return this.router.navigate(['/mock-data']);
        }
        this.mockData = this.fileFactory.create();
    }

    public trySave (file: MockData) {
        super.saveFile(file)
        .subscribe(() => {
            this.router.navigate(['/mock-data', file.name]);
        }, () => {
            this.notifierService.error('Mock data was not saved.');
        });
    }
}
