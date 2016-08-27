'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Factory } from '../../../shared/factory/factory.interface';

// Constants:
const TYPES = ['Given', 'When', 'Then', 'And', 'But'];

@Injectable()
export class StepDeclarationFactory implements Factory<StepDeclaration> {
    public create (options?): StepDeclaration {
        let instance = new StepDeclaration();
        return instance;
    }
}

export class StepDeclaration {
    private _types: Array<string> = TYPES;

    public step: string = '';
    public type: string;

    constructor () {
        let [type] = this.types;
        this.type = type;
    }

    public get types () {
        return this._types;
    }

    public get feature (): string {
        return this.toFeatureString();
    }

    private toFeatureString (): string {
        return `${this.type} ${this.step}`;
    }
}
