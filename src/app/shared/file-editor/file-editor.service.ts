'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/rx';

// Dependencies:
import { FileService } from '../file/file.service';
import { FileStructure } from '../file-structure/file-structure.interface';

export class FileEditorService<T> {
    private fileStructure: FileStructure;

    constructor (
        private fileService: FileService<T>
        // $state,
        // confirmDialogService,
        // persistentStateService,
        // notifierService
        // FileModel,
        // fileStructure,
        // filePath
    ) {
        // this.$state = $state;
        // this.confirmDialogService = confirmDialogService;
        // this.persistentStateService = persistentStateService;
        // this.notifierService = notifierService;
        // this.fileService = fileService;
        // this.FileModel = FileModel;
        // this.fileStructure = fileStructure;
        //
        // this.availableComponents = fileStructure.availableComponents;
        // this.availableMockData = fileStructure.availableMockData;

        // if (filePath) {
        //     let { path } = filePath;
        //     this.fileService.openFile({ path }, this.availableComponents, this.availableMockData)
        //     .then(file => this.fileModel = file);
        // } else if (FileModel && !this.fileModel) {
        //     this.newFile();
        // }
    }

    openFile (name: string) {

    }

    saveFile (fileModel: T) {

    }

    showErrors () {
        // let fileEditor = this.fileEditor;
        // if (fileEditor.$invalid) {
        //     Object.keys(fileEditor.$error).forEach((invalidType) => {
        //         fileEditor.$error[invalidType].forEach((element) => {
        //             element.$setTouched();
        //         });
        //     });
        //     this.notifierService.error(`Can't save file, something is invalid.`);
        // }
        // return !fileEditor.$invalid;
    }

    minimise (item) {
        // item.minimised = !item.minimised;
        //
        // let displayState = this.persistentStateService.get(this.fileModel.name);
        // displayState[item.name] = item.minimised;
        // this.persistentStateService.set(this.fileModel.name, displayState);
    }
}
