'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import {
    GET,
    REFRESH,
    SET_LOCATION,
    GET_LOCATION_ABS_URL,
    WAIT_FOR_ANGULAR
} from './browser-methods';
import { Factory } from '../../../shared/factory/factory.interface';

@Injectable()
export class BrowserFactory implements Factory<Browser> {
    public create (): Browser {
        let instance = new Browser();
        return instance;
    }
}

export class Browser {
    private _name: string = 'browser';
    private _methods: Array<any> = [
        GET,
        REFRESH,
        SET_LOCATION,
        GET_LOCATION_ABS_URL,
        WAIT_FOR_ANGULAR
    ];

    public get name (): string {
        return this._name;
    }

    public get methods (): Array<any> {
        return this._methods;
    }

    public get variableName (): string {
        return this._name;
    }
}
