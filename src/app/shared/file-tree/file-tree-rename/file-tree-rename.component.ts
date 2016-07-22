'use strict';

// Angular:
import { Component, Input, OnInit } from '@angular/core';

// Utilities:
import * as path from 'path';

// Dependencies:
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';
import { FileStructureService } from '../../file-structure/file-structure.service';
import { FileTypesService, FILE_TYPES_PROVIDERS } from '../../file-types/file-types.service';
import { FocusOnDirective } from '../../focus-on/focus-on.directive';

// Constants:
const ENTER_KEY_CODE = 13;

@Component({
    moduleId: module.id,
    selector: 'tractor-file-tree-rename',
    templateUrl: 'file-tree-rename.component.html',
    styleUrls: ['file-tree-rename.component.css'],
    directives: [FocusOnDirective],
    providers: [FILE_TYPES_PROVIDERS]
})
export class FileTreeRenameComponent implements OnInit {
    @Input() public item: FileStructureItem;

    private type: string;

    constructor (
        private fileStructureService: FileStructureService,
        private fileTypesService: FileTypesService
    ) { }

    public ngOnInit () {
        this.type = this.fileTypesService.getServerType();
    }

    public renameOnEnter ($event: KeyboardEvent, item: FileStructureItem) {
        if ($event.keyCode === ENTER_KEY_CODE) {
            this.saveNewName(item);
        }
    }

    public saveNewName (item: FileStructureItem): void {
        item.editingName = false;

        let valid = true;
        if (item.name.includes('_')) {
            // this.notifierService.error('Invalid character: "_"');
            valid = false;
        }
        if (item.name.includes('/')) {
            // this.notifierService.error('Invalid character: "/"');
            valid = false;
        }
        if (item.name.includes('\\')) {
            // this.notifierService.error('Invalid character: "\\"');
            valid = false;
        }
        if (!item.name.trim().length) {
            valid = false;
        }

        if (!valid) {
            item.name = item.previousName;
        }

        if (item.name !== item.previousName) {
            let directoryPath = this.getDirname(item.path);
            let oldName = item.previousName;
            let newName = item.name;

            let options = { directoryPath, oldName, newName }

            let isDirectory = !!item.isDirectory;
            if (isDirectory) {
                this.fileStructureService.editDirectoryPath(this.type, options);
            } else {
                this.fileStructureService.editFilePath(this.type, options);
            }
        }
    }

    private getDirname (filePath: string): string {
        // Sw33t hax()rz to get around the node "path" shim not working on Windows.
        let haxedFilePath = filePath.replace(/\\/g, '/');
        let dirname = path.dirname(haxedFilePath);
        if (haxedFilePath !== filePath) {
            dirname = dirname.replace(/\//g, '\\');
        }
        return dirname;
    }
}
