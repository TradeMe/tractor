'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Factory } from '../../../shared/factory/factory.interface';
import { FEATURE_INDENT } from '../../../config/constants';
import { Scenario } from '../scenario/scenario';
import { StringToLiteralService } from '../../../shared/string-to-literal/string-to-literal.service';

@Injectable()
export class ExampleFactory implements Factory<Example> {
    constructor (
        private stringToLiteralService: StringToLiteralService
    ) { }

    public create (scenario?: Scenario): Example {
        let instance = new Example(this.stringToLiteralService);
        instance.init(scenario);
        return instance;
    }
}


export class Example {
    private _scenario: Scenario;
    private _values: any = {};

    constructor (
        private stringToLiteralService: StringToLiteralService
    ) { }

    public get feature (): string {
        return this.toFeatureString();
    }

    public get scenario (): Scenario {
        return this._scenario;
    }

    public get values (): any {
        this.scenario.exampleVariables.forEach(exampleVariable => {
            this._values[exampleVariable] = this._values[exampleVariable] || {
                value: ''
            };
        });
        return this._values;
    }

    public init (scenario: Scenario) {
        this._scenario = scenario;
    }

    private toFeatureString (): string {
        let values = this.scenario.exampleVariables.map(variable => {
            let value = this.values[variable].value;
            let literal = this.stringToLiteralService.toLiteral(value);
            return isUndefined(literal) ? `"${value}"` : literal;
        }).join(' | ');
        return `${FEATURE_INDENT}${FEATURE_INDENT}${FEATURE_INDENT}| ${values} |`;
    }
}

// TODO: Use angular utilities:
function isUndefined (obj: any): boolean {
    return obj === undefined;
}
