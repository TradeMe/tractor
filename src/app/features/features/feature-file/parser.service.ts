'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Feature, FeatureFactory } from '../feature/feature';
import { Parser } from '../../../shared/parser/parser.interface';
import { ScenarioParserService } from '../scenario/parser.service';

@Injectable()
export class FeatureParserService implements Parser<Feature> {
    constructor (
        private featureFactory: FeatureFactory,
        private scenarioParserService: ScenarioParserService
    ) { }

    parse (featureFile): Feature {
        let { tokens } = featureFile;
        try {
            let feature = this.featureFactory.create({
                isSaved: true,
                path: featureFile.path
            });

            let [featureTokens] = tokens;

            this.parseFeature(feature, featureTokens);

            let parsers = [this.parseScenarios];
            this.tryParse(feature, featureTokens, parsers);

            return feature;
        } catch (e) {
            console.warn('Invalid feature:', tokens);
            return null;
        }
    }

    private parseFeature (feature: Feature, tokens) {
        feature.name = tokens.name;
        assert(feature.name);
        feature.inOrderTo = tokens.inOrderTo;
        assert(feature.inOrderTo);
        feature.asA = tokens.asA;
        assert(feature.asA);
        feature.iWant = tokens.iWant;
        assert(feature.iWant);
    }

    private parseScenarios (feature: Feature, tokens) {
        tokens.elements.forEach((element) => {
            let parsedScenario = this.scenarioParserService.parse(element);
            assert(parsedScenario);
            feature.scenarios.push(parsedScenario);
        });
        return true;
    }

    private tryParse (feature: Feature, tokens, parsers) {
        let parsed = parsers.some(parser => {
            try {
                return parser.call(this, feature, tokens);
            } catch (e) { }
        });
        if (!parsed) {
            throw new Error();
        }
    }
}
