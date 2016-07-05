'use strict';

// Angular:
import { Http } from '@angular/http';
import { Observable } from 'rxjs/rx';

// Utilities:
import { clientToServerFilePath } from '../utilities/url-utilities';
import { createSearchParams, handleResponse } from '../utilities/http-utilities';

// Dependencies:
import { FileStructure } from '../file-structure/file-structure.interface';
import { FileStructureService } from '../file-structure/file-structure.service';
import { Parser } from '../parser/parser.interface';

export class FileService<T> {
    constructor (
        private http: Http,
        private parserService: Parser<T>,
        private fileStructureService: FileStructureService,
        private type: string
    ) { }

    public getFileStructure (): Observable<FileStructure> {
        this.fileStructureService.getFileStructure(this.type);
        return this.fileStructureService.fileStructureChange$;
    }

    public getPath (name: string, path?: string): Observable<string> {
        name = clientToServerFilePath(name);
        let search = createSearchParams({ path, name });

        return handleResponse(this.http.get(`http://localhost:4000/${this.type}/file/path`, { search }))
        .map((filePath: any) => filePath.path);
    }

    public openFile (path: string, availableComponents?, availableMockData?): Observable<T> {
        path = clientToServerFilePath(path);
        let search = createSearchParams({ path });

        return handleResponse(this.http.get(`http://localhost:4000/${this.type}/file`, { search }))
        .map((file: any) => this.parserService.parse(file, availableComponents, availableMockData));
    }

    public saveFile (options) {
        return this.http.put(`http://localhost:4000/${this.type}/file`, options);
    }
}
