'use strict';

// Angular:
import { Component, Input, OnInit } from '@angular/core';

// Utilities:
import * as path from 'path';
import * as titlecase from 'title-case';

// Dependencies:
import { DropFileDirective } from './drop-file/drop-file.directive';
import { Directory } from '../file-structure/directory.interface';
import { FileStructureItem } from '../file-structure/file-structure-item.interface';
import { FileStructureService } from '../file-structure/file-structure.service';
import { FileTreeDirectoryComponent } from './file-tree-directory/file-tree-directory.component';
import { FileTypesService, FILE_TYPES_PROVIDERS } from '../file-types/file-types.service';

@Component({
    moduleId: module.id,
    selector: 'tractor-file-tree',
    templateUrl: 'file-tree.component.html',
    styleUrls: ['file-tree.component.css'],
    directives: [DropFileDirective, FileTreeDirectoryComponent],
    providers: [FILE_TYPES_PROVIDERS]
})
export class FileTreeComponent implements OnInit {
    @Input() public directory: Directory;

    public canModify: boolean;
    public headerName: string;

    private type: string;

    constructor (
        private fileTypesService: FileTypesService,
        private fileStructureService: FileStructureService
    ) { }

    public ngOnInit (): void {
        this.type = this.fileTypesService.getServerType();

        // TODO: Fix this when server renames everything to Page Objects
        if (this.type === 'components') {
            this.headerName = 'Page Object';
        } else {
            this.headerName = titlecase(this.type);
        }

        this.editFilePath = this.editFilePath.bind(this);
    }

    // Currently duplicated in file-tree-directory.component.ts, should probably
    // move to file.service.ts:
    public editFilePath (file: FileStructureItem, directory: Directory): void {
        let { name } = file
        let oldDirectoryPath = this.getDirname(file.path);
        let newDirectoryPath = directory.path;
        if (oldDirectoryPath !== newDirectoryPath) {
            let options = { oldDirectoryPath, newDirectoryPath, name };
            this.fileStructureService.editFilePath(this.type, options);
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
