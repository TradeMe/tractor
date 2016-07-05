'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/rx';

// Utilities:
import { createJSONHeaders, createSearchParams, handleResponse } from '../utilities/http-utilities';

// Dependencies:
import { Directory } from './directory.interface';
import { FileStructure } from './file-structure.interface';
import { FileStructureItem } from './file-structure-item.interface';
// import MockDataParserService from '../../features/MockDataEditor/Services/MockDataParserService';
import { PersistentStateService, PERSISTENT_STATE_PROVIDERS } from '../persistent-state/persistent-state.service';
import { PageObjectParserService, PAGE_OBJECT_PARSER_PROVIDERS } from '../../+page-objects/page-object/parser.service';
import { Parser } from '../parser/parser.interface';

// Constants:
const OPEN_DIRECTORIES = 'OpenDirectories';

@Injectable()
export class FileStructureService {
    public fileStructure: FileStructure;
    public fileStructureChange$: Subject<FileStructure> = new Subject<FileStructure>();

    constructor (
        private http: Http,
        private pageObjectParserService: PageObjectParserService,
        // mockDataParserService,
        private persistentStateService: PersistentStateService
    ) {
        // this.mockDataParserService = mockDataParserService;
    }

    public getFileStructure (type: string): void {
        this.updateFileStructure(this.http.get(`http://localhost:4000/${type}/file-structure`));
    }

    public addDirectory (type: string, body): void {
        body = JSON.stringify(body);
        let options = { headers: createJSONHeaders() };

        this.updateFileStructure(this.http.post(`http://localhost:4000/${type}/directory`, body, options));
    }

    public checkFileExists (path: string): boolean {
        return !!this.findFileByPath(path);
    }

    public copyFile (type: string, body): void {
        body = JSON.stringify(body);
        let headers = createJSONHeaders();
        let options = { headers };

        this.updateFileStructure(this.http.post(`http://localhost:4000/${type}/file/copy`, body, options));
    }

    public deleteDirectory (type: string, body): void {
        let search = createSearchParams(body);
        let headers = createJSONHeaders();
        let options = { search, headers };

        this.updateFileStructure(this.http.delete(`http://localhost:4000/${type}/directory`, options));
    }

    public deleteFile (type: string, body): void {
        body = JSON.stringify(body);
        let headers = createJSONHeaders();
        let options = { body, headers };

        this.updateFileStructure(this.http.delete(`http://localhost:4000/${type}/file`, options));
    }

    public editDirectoryPath (type, body): void {
        body.isDirectory = true;
        body = JSON.stringify(body);
        let headers = createJSONHeaders();
        let options = { headers };

        this.updateFileStructure(this.http.patch(`http://localhost:4000/${type}/directory/path`, body, options));
    }

    public editFilePath (type: string, body): void {
        body = JSON.stringify(body);
        let headers = createJSONHeaders();
        let options = { headers };

        this.updateFileStructure(this.http.patch(`http://localhost:4000/${type}/file/path`, body, options));
    }

    public toggleOpenDirectory (directoryPath: string): void {
        let openDirectories = this.getOpenDirectories();
        if (openDirectories[directoryPath]) {
            delete openDirectories[directoryPath];
        } else {
            openDirectories[directoryPath] = true;
        }
        this.persistentStateService.set(OPEN_DIRECTORIES, openDirectories);
    }

    private parsePageObjectsAndMockData (fileStructure: FileStructure): FileStructure {
        // let { availableComponents, availableMockData } = fileStructure;
        // if (availableComponents && availableMockData) {
        //     fileStructure.availableComponents = availableComponents.map(component => {
        //         return this.componentParserService.parse(component);
        //     });
        //     fileStructure.availableMockData = availableMockData.map(mockData => {
        //         return this.mockDataParserService.parse(mockData);
        //     });
        // }
        return fileStructure;
    }

    private findFileByPath (path: string): FileStructureItem {
        return this.fileStructure.directory.allFiles.find((file: FileStructureItem) => {
            return file.path.includes(path) || file.path.includes(path.replace(/\//g, '\\'));
        });
    }

    private getAllFiles (directory: Directory, allFiles = []) {
        directory.directories.forEach(subdirectory => {
            allFiles = this.getAllFiles(subdirectory, allFiles);
        });
        allFiles = allFiles.concat(directory.files);
        return allFiles;
    }

    private getOpenDirectories () {
        return this.persistentStateService.get(OPEN_DIRECTORIES);
    }

    private restoreOpenDirectories (directory) {
        directory.directories.forEach(subdirectory => {
            this.restoreOpenDirectories(subdirectory);
        });
        directory.open = !!this.getOpenDirectories()[directory.path];
        return directory;
    }

    private updateFileStructure (response: Observable<Response>): void {
        handleResponse(response)
        .map((fileStructure: FileStructure) => {
            this.fileStructure = fileStructure;
            this.fileStructureChange$.next(this.fileStructure);
            fileStructure.directory = this.restoreOpenDirectories(fileStructure.directory);
            fileStructure.directory.allFiles = this.getAllFiles(fileStructure.directory);
            fileStructure.directory.open = true;
            return this.fileStructure;
        })
        .subscribe(() => { debugger; }, () => { debugger; });
    }
}

export const FILE_STRUCTURE_PROVIDERS = [
    FileStructureService,
    PERSISTENT_STATE_PROVIDERS,
    PAGE_OBJECT_PARSER_PROVIDERS
];
