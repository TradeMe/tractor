'use strict';

// Angular:
import { Injectable } from '@angular/core';

// Dependencies:
import { ASTService } from '../../../shared/ast/ast.service';
import { Mock, MockFactory } from '../mock/mock';
import { Parser } from '../../../shared/parser/parser.interface';
import { Step } from '../step/step';

@Injectable()
export class MockParserService implements Parser<Mock> {
    constructor (
        private astService: ASTService,
        private mockFactory: MockFactory
    ) { }

    public parse (step: Step, ast): Mock {
        try {
            let mock = this.mockFactory.create(step);

            let mockCallExpression = ast.expression;

            this.parseAction(mock, mockCallExpression);
            this.parseUrl(mock, mockCallExpression);

            let parsers = [this.parseData, this.parsePassThrough];
            this.tryParse(mock, mockCallExpression, parsers);

            return mock;
        } catch (e) {
            console.warn('Invalid mock:', this.astService.toJS(ast));
            return null;
        }
    }

    private tryParse (mock: Mock, mockCallExpression, parsers): void {
        let parsed = parsers.some(parser => {
            try {
                return parser.call(this, mock, mockCallExpression);
            } catch (e) {}
        });
        if (!parsed) {
            throw new Error();
        }
    }

    private parseAction (mock: Mock, mockCallExpression): boolean {
        let action = mockCallExpression.callee.object.callee.property.name.replace(/^when/, '');
        assert(action);
        assert(mock.actions.includes(action));
        mock.action = action;
        return true;
    }

    private parseUrl (mock: Mock, mockCallExpression): boolean {
        let [argument] = mockCallExpression.callee.object.arguments.slice().reverse();
        let url = argument.raw;
        let urlRegex = new RegExp(url.replace(/^\//, '').replace(/\/$/, ''));
        assert(urlRegex);
        mock.url = urlRegex.source;
        return true;
    }

    private parseData (mock: Mock, mockCallExpression): boolean {
        let [argument] = mockCallExpression.arguments;
        let instanceName = argument.name;
        mock.mockData = mock.step.stepDefinition.mockDataInstances.find(mockDataInstance => {
            return mockDataInstance.variableName === instanceName;
        });
        return true;
    }

    private parsePassThrough (mock: Mock, mockCallExpression): boolean {
        assert(mockCallExpression.callee.property.name === 'passThrough');
        mock.passThrough = true;
        return true;
    }
}
