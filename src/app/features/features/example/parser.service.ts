'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Example, ExampleFactory } from './example';
import { Parser } from '../../../shared/parser/parser.interface';
import { Scenario } from '../scenario/scenario';

@Injectable()
export class ExampleParserService implements Parser<Example> {
    constructor (
        private exampleFactory: ExampleFactory
    ) { }

    parse (scenario: Scenario, tokens): Example {
        try {
            let example = this.exampleFactory.create(scenario);

            scenario.exampleVariables.forEach((variable, index) => {
                example.values[variable] = tokens[index].replace(/^"/, '').replace(/"$/, '');
            });

            return example;
        } catch (e) {
            console.warn('Invalid example:', tokens);
            return null;
        }
    }
}
