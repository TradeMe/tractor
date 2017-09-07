'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Factory } from '../../../shared/factory/factory.interface';
import { FileStructureItem } from '../../../shared/file-structure/file-structure-item.interface';

@Injectable()
export class MockDataFactory implements Factory<MockData> {
    public create (json: string, options?): MockData {
        let instance = new MockData();
        instance.init(json, options);
        return instance;
    }
}

export class MockData implements FileStructureItem {
    private _options;
    private _json: string;

    public name: string = '';

    public get data () {
        return this.json;
    }

    public get isSaved (): boolean {
        return !!this._options.isSaved;
    }


    public get json (): string {
        let formatted;
        try {
            formatted = JSON.stringify(JSON.parse(this._json), null, '    ');
        } catch (e) {
            formatted = this._json;
        }
        return formatted;
    }

    public set json (newJSON: string) {
        this._json = newJSON;
    }

    public get path (): string {
        return this._options.path;
    }

    public init (_json = '{}', _options = {}): void {
        this._json = _json;
        this._options = _options;
    }
}
