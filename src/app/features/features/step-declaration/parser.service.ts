'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { Parser } from '../../../shared/parser/parser.interface';
import { StepDeclaration, StepDeclarationFactory } from './step-declaration';

@Injectable()
export class StepDeclarationParserService implements Parser<StepDeclaration> {
    constructor (
        private stepDeclarationFactory: StepDeclarationFactory
    ) { }

    public parse (tokens): StepDeclaration {
        try {
            let stepDeclaration = this.stepDeclarationFactory.create();

            this.parseStepDeclaration(stepDeclaration, tokens);

            return stepDeclaration;
        } catch (e) {
            console.warn('Invaid step declarartion:', tokens);
            return null;
        }
    }

    private parseStepDeclaration (stepDeclaration, tokens) {
        stepDeclaration.type = tokens.type;
        assert(stepDeclaration.type);
        stepDeclaration.step = tokens.step;
        assert(stepDeclaration.step);
    }
}
