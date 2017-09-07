'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Parser } from '../../../shared/parser/parser.interface';
import { StepParserService } from '../step/parser.service';
import { StepDefinition, StepDefinitionFactory } from '../step-definition/step-definition';

@Injectable()
export class StepDefinitionParserService implements Parser<StepDefinition> {
    constructor (
        private astService: ASTService,
        private stepDefinitionFactory: StepDefinitionFactory,
        private stepParserService: StepParserService
    ) { }

    public parse (stepDefinitionFile, availableComponents, availableMockData): StepDefinition {
        try {
            let ast = stepDefinitionFile.ast;
            let [metaComment] = ast.comments;
            let meta = JSON.parse(metaComment.value);

            let stepDefinition = this.stepDefinitionFactory.create({
                availableComponents,
                availableMockData,
                path: stepDefinitionFile.path
            });
            stepDefinition.name = meta.name;

            let [module] = ast.body;
            let statements = module.expression.right.body.body;

            let parsers = [this.parseComponent, this.parseMock, this.parseStep];
            this.tryParse(stepDefinition, statements, meta, parsers);

            return stepDefinition;
        } catch (e) {
            console.warn('Invalid step definition:', this.astService.toJS(stepDefinitionFile.ast));
            return null;
        }
    }

    private tryParse (stepDefinition: StepDefinition, statements, meta, parsers): void {
        statements.map(statement => {
            let parsed = parsers.some(parser => {
                try {
                    return parser.call(this, stepDefinition, statement, meta);
                } catch (e) { }
            });
            if (!parsed) {
                throw new Error();
            }
        });
    }

    private parseComponent (stepDefinition: StepDefinition, statement, meta): boolean {
        let [declarator] = statement.declarations.slice().reverse();
        let name = declarator.init.callee.name;
        assert(name !== 'require');
        stepDefinition.addPageObject(meta.components[stepDefinition.pageObjects.length].name);
        return true;
    }

    private parseMock (stepDefinition: StepDefinition, statement, meta): boolean {
        let [declarator] = statement.declarations;
        let name = declarator.init.callee.name;
        assert(name === 'require');
        let [path] = declarator.init.arguments;
        assert(path.value.match(/\.mock.json$/));
        stepDefinition.addMock(meta.mockData[stepDefinition.mockData.length].name);
        return true;
    }

    private parseStep (stepDefinition: StepDefinition, statement): boolean {
        let step = this.stepParserService.parse(stepDefinition, statement);
        assert(step);
        stepDefinition.step = step;
        return true;
    }
}
