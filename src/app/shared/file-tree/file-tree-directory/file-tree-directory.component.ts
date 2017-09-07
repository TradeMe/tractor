'use strict';

// Angular:
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Utilities:
import { serverToClientFilePath } from '../../utilities/url-utilities';
import * as path from 'path';

// Dependencies:
import { Directory } from '../../file-structure/directory.interface';
import { FileStructureItem } from '../../file-structure/file-structure-item.interface';
import { FileStructureService } from '../../file-structure/file-structure.service';
import { FileTypesService } from '../../file-types/file-types.service';

// Constants:
const STEP_DEFINITIONS = 'step-definitions';

@Component({
    selector: 'tractor-file-tree-directory',
    templateUrl: 'file-tree-directory.component.html',
    styleUrls: ['file-tree-directory.component.scss']
})
export class FileTreeDirectoryComponent implements OnInit {
    @Input() public directory: Directory;

    public canModify: boolean;

    private type: string;

    constructor (
        private fileStructureService: FileStructureService,
        private fileTypesService: FileTypesService,
        private router: Router
    ) { }

    public ngOnInit () {
        this.type = this.fileTypesService.getServerType();
        this.canModify = this.type !== STEP_DEFINITIONS;

        this.editFilePath = this.editFilePath.bind(this);
    }

    public addDirectory (directory: Directory): void {
        let { path } = directory;
        this.fileStructureService.addDirectory(this.type, { path });
    }

    public getName (item: FileStructureItem): string {
        if (item.ast) {
            let [metaComment] = item.ast.comments;
            let meta = JSON.parse(metaComment.value);
            return meta.name;
        }
        return item.name;
    }

    // Currently duplicated in file-tree.component.ts, should probably
    // move to file.service.ts:
    public editFilePath (file: FileStructureItem, directory: Directory): void {
        let { name } = file;
        let oldDirectoryPath = this.getDirname(file.path);
        let newDirectoryPath = directory.path;
        if (oldDirectoryPath !== newDirectoryPath) {
            let options = { oldDirectoryPath, newDirectoryPath, name };
            this.fileStructureService.editFilePath(this.type, options);
        }
    }

    public editName (item: FileStructureItem): void {
        item.editingName = true;
        item.previousName = item.name;
    }

    public isRoot (directory: Directory): boolean {
        // TODO: This should come from the API:
        return directory && directory.allFiles != null;
    }

    public openFile (file: FileStructureItem): void {
        let directoryPath = this.fileStructureService.fileStructure.directory.path.replace(/\\/g, '/');
        let filePath = file.path.replace(/\\/g, '/');
        let name = path.relative(directoryPath, filePath);
        name = serverToClientFilePath(name.substring(0, name.indexOf('.')));

        let type = this.fileTypesService.getType();
        this.router.navigate([`/${type}`, name]);
    }

    public toggleOpenDirectory (item): void {
        item.open = !item.open;
        this.fileStructureService.toggleOpenDirectory(item.path);
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
