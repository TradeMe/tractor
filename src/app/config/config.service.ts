'use strict';

// Angular:
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/rx';

// Utilities:
import { handleResponse } from '../shared/utilities/http-utilities';

// Dependencies:
import { TractorConfig } from './config.interface';

// Constants:
const CONFIG_URL = 'http://localhost:4000/config';

@Injectable()
export class ConfigService implements TractorConfig {
    private config: TractorConfig = {
        environments: []
    };

    public get environments (): Array<string> {
        return this.config.environments;
    }

    public get port (): number {
        return this.config.port;
    }

    public get testDirectory (): string {
        return this.config.testDirectory;
    }

    constructor (
        private http: Http
    ) { }

    getConfig (): Subscription {
        return handleResponse(this.http.get(CONFIG_URL))
        .subscribe((config: TractorConfig) => {
            this.config = config;
        });
    }
}
