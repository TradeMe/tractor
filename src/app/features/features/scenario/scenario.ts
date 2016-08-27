'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Example, ExampleFactory } from '../example/example';
import { Factory } from '../../../shared/factory/factory.interface';
import { FEATURE_INDENT, FEATURE_NEWLINE } from '../../../config/constants';
import { StepDeclaration, StepDeclarationFactory } from '../step-declaration/step-declaration';

@Injectable()
export class ScenarioFactory implements Factory<Scenario> {
    constructor (
        private exampleFactory: ExampleFactory,
        private stepDeclarationFactory: StepDeclarationFactory
    ) { }

    public create (options?): Scenario {
        let instance = new Scenario(this.exampleFactory, this.stepDeclarationFactory);
        return instance;
    }
}


export class Scenario {
    private _examples: Array<Example> = [];
    private _stepDeclarations: Array<StepDeclaration> = [];

    public name: string = '';

    public get examples (): Array<Example> {
        return this._examples;
    }

    public get exampleVariables () {
        return this.getExampleVariables(this.stepDeclarations);
    }

    public get featureString (): string {
        return this.toFeatureString();
    }

    public get stepDeclarations (): Array<StepDeclaration> {
        return this._stepDeclarations;
    }

    constructor (
        private exampleFactory: ExampleFactory,
        private stepDeclarationFactory: StepDeclarationFactory
    ) { }

    public addExample (): void {
        this.examples.push(this.exampleFactory.create());
    }

    public removeExample (toRemove: Example): void {
        this.examples.splice(this.examples.findIndex(example => {
            return example === toRemove;
        }), 1);
    }

    public addStepDeclaration (): void {
        this.stepDeclarations.push(this.stepDeclarationFactory.create());
    }

    public removeStepDeclaration (toRemove: StepDeclaration): void {
        this.stepDeclarations.splice(this.stepDeclarations.findIndex(stepDeclaration => {
            return stepDeclaration === toRemove;
        }), 1);
    }

    private getExampleVariableNames (step: string): Array<string> {
        let matches = step.match(new RegExp('<.+?>', 'g'));
        if (matches) {
            return matches.map(result => result.replace(/^</, '').replace(/>$/, ''));
        } else {
            return [];
        }
    }

    private getExampleVariables (stepDeclarations: Array<StepDeclaration>): Array<string> {
        let steps = stepDeclarations.map(stepDeclaration => stepDeclaration.step);
        let variableNames = steps.map(this.getExampleVariableNames);
        variableNames = [].concat.apply([], variableNames);
        // TODO: Types are fucked up here, fix them:
        return <Array<string>>Array.from((<any>new Set(variableNames)));
    }

    private toFeatureString (): string {
        let scenario = `Scenario${(this.examples.length ? ' Outline' : '')}: ${this.name}`;

        let stepDeclarations = this.stepDeclarations.map(stepDeclaration => {
            return `${FEATURE_INDENT}${FEATURE_INDENT}${stepDeclaration.feature}`;
        });

        let lines = [scenario, stepDeclarations];
        if (this.examples.length) {
            lines.push(`${FEATURE_INDENT}${FEATURE_INDENT}Examples:`);
            let joinedVariables = this.exampleVariables.join(' | ');
            lines.push(`${FEATURE_INDENT}${FEATURE_INDENT}${FEATURE_INDENT}| ${joinedVariables} |`);
            this.examples.forEach(example => lines.push(example.feature));
        }

        // lines = flatten(lines);
        return lines.join(FEATURE_NEWLINE);
    }
}

// ScenarioModel.getExampleVariableNames = getExampleVariableNames;
