'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Factory } from '../../../shared/factory/factory.interface';
import { FEATURE_INDENT, FEATURE_NEWLINE } from '../../../config/constants';
import { FileStructureItem } from '../../../shared/file-structure/file-structure-item.interface';
import { Scenario, ScenarioFactory } from '../scenario/scenario';

@Injectable()
export class FeatureFactory implements Factory<Feature> {
    constructor (
        private scenarioFactory: ScenarioFactory
    ) { }

    public create (options?): Feature {
        let instance = new Feature(this.scenarioFactory);
        instance.init(options);
        return instance;
    }
}

export class Feature implements FileStructureItem {
    private _options;
    private _scenarios: Array<Scenario> = [];

    public asA: string = '';
    public inOrderTo: string = '';
    public iWant: string = '';
    public name: string = '';

    public get isSaved (): boolean {
        return !!this._options.isSaved;
    }

    public get path (): string {
        return this._options.path;
    }

    public get scenarios (): Array<Scenario> {
        return this._scenarios;
    }

    public get featureString (): string {
        return this.toFeatureString();
    }

    public get data (): string {
        return this.featureString;
    }

    constructor (
        private scenarioFactory: ScenarioFactory
    ) { }

    public init (options = {}): void {
        this._options = options;
    }

    public addScenario (): void {
        this.scenarios.push(this.scenarioFactory.create());
    }

    public removeScenario (toRemove: Scenario): void {
        this.scenarios.splice(this.scenarios.findIndex(scenario => {
            return scenario === toRemove;
        }), 1);
    }

    private toFeatureString (): string {
        let feature = `Feature: ${this.name}`;

        let inOrderTo = `${FEATURE_INDENT}In order to ${this.inOrderTo}`;
        let asA = `${FEATURE_INDENT}As a ${this.asA}`;
        let iWant = `${FEATURE_INDENT}I want ${this.iWant}`;

        let scenarios = this.scenarios.map(scenario => {
            return `${FEATURE_INDENT}${scenario.featureString}`;
        });

        let lines = [];//flatten([feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(FEATURE_NEWLINE);
    }
}
