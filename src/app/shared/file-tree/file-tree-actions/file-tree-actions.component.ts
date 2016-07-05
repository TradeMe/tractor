'use strict';

// Angular:
import { Component, Input, OnInit } from '@angular/core';

// Dependencies:
import { ButtonComponent } from '../../button/button.component';
import { Directory } from '../../file-structure/directory.interface';
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';
import { FileStructureService } from '../../file-structure/file-structure.service';
import { FileTypesService, FILE_TYPES_PROVIDERS } from '../../file-types/file-types.service';

// Constants:
const STEP_DEFINITIONS = 'step-definitions';

@Component({
    moduleId: module.id,
    selector: 'tractor-file-tree-actions',
    templateUrl: 'file-tree-actions.component.html',
    styleUrls: ['file-tree-actions.component.css'],
    directives: [ButtonComponent],
    providers: [FILE_TYPES_PROVIDERS]
})
export class FileTreeActionsComponent implements OnInit {
    @Input() public item: FileStructureItem;

    public canModify: boolean;

    private type: string;

    constructor (
        private fileStructureService: FileStructureService,
        private fileTypesService: FileTypesService
    ) { }

    public ngOnInit (): void {
        this.type = this.fileTypesService.getType();
        this.canModify = this.type !== STEP_DEFINITIONS;
    }

    public copy (item: FileStructureItem): void {
        let { path } = item;
        this.fileStructureService.copyFile(this.type, { path });
    }

    public delete (item: FileStructureItem): void {
        this.hideActions(item);

        let { name, path } = item;
        let deleteOptions = { name, path };

        if (item.isDirectory) {
            let directory = <Directory>item;
            let hasChildren = directory.files && directory.files.length || directory.directories && directory.directories.length;
            if (!hasChildren || confirm('All directory contents will be deleted as well. Continue?')) {
                this.fileStructureService.deleteDirectory(this.type, deleteOptions);
            }
        } else {
            this.fileStructureService.deleteFile(this.type, deleteOptions);
        }
    }

    public editName (item: FileStructureItem): void {
        item.editingName = true;
        item.previousName = item.name;
    }

    public hideActions (item: FileStructureItem): void {
        item.showActions = false;
    }

    public showActions (item: FileStructureItem): void {
        item.showActions = true;
    }
}
