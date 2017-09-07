'use strict';

// Angular:
import { Injectable, provide } from '@angular/core';

// Dependencies:
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

// Constants:
const LOCAL_STORAGE_PREFIX = 'tractor';
const LOCAL_STORAGE_CONFIG_PROVIDER = provide(LOCAL_STORAGE_SERVICE_CONFIG, {
    useValue: {
        prefix: LOCAL_STORAGE_PREFIX
    }
});
const PERSISTENT_STATE_KEY = 'PERSISTENT_STATE';

@Injectable()
export class PersistentStateService {
    constructor (
        private localStorageService: LocalStorageService
    ) { }

    public get (name: string): any {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        return state[name] || {};
    }

    public set (name: string, value: any): void {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        state[name] = value;
        this.localStorageService.set(PERSISTENT_STATE_KEY, state);
    }

    public remove (name: string): void {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        delete state[name];
        this.localStorageService.set(PERSISTENT_STATE_KEY, state);
    }
}
