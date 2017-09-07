'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ExampleParserService } from '../example/parser.service';
import { Parser } from '../../../shared/parser/parser.interface';
import { Scenario, ScenarioFactory } from '../scenario/scenario';
import { StepDeclarationParserService } from '../step-declaration/parser.service';

@Injectable()
export class ScenarioParserService implements Parser<Scenario> {
    constructor (
        private exampleParserService: ExampleParserService,
        private scenarioFactory: ScenarioFactory,
        private stepDeclarationParserService: StepDeclarationParserService
    ) { }

    public parse (tokens): Scenario {
        try {
            let scenario = this.scenarioFactory.create();

            this.parseScenario(scenario, tokens);

            let parsers = [this.parseStepDeclarations, this.parseExamples];
            this.tryParse(scenario, tokens, parsers);

            return scenario;
        } catch (e) {
            console.warn('Invalid scenario:', tokens);
            return null;
        }
    }

    private parseScenario (scenario: Scenario, tokens): void {
        scenario.name = tokens.name;
        assert(scenario.name);
    }

    private tryParse (scenario: Scenario, tokens, parsers): void {
        let parsed = parsers.every(parser => {
            try {
                return parser.call(this, scenario, tokens);
            } catch (e) { }
        });
        if (!parsed) {
            throw new Error();
        }
    }

    private parseStepDeclarations (scenario: Scenario, tokens): boolean {
        tokens.stepDeclarations.forEach((stepDeclaration) => {
            let parsedStepDeclaration = this.stepDeclarationParserService.parse(stepDeclaration);
            assert(parsedStepDeclaration);
            scenario.stepDeclarations.push(parsedStepDeclaration);
        });
        return true;
    }

    private parseExamples (scenario: Scenario, tokens): boolean {
        tokens.examples.forEach((example) => {
            let parsedExample = this.exampleParserService.parse(scenario, example);
            assert(parsedExample);
            scenario.examples.push(parsedExample);
        });
        return true;
    }
}
