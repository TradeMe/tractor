// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import './header';

// Constants:
const ACTIONS = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];

function createMockRequestModelConstructor (
    astCreatorService,
    HeaderModel
) {
    return class MockRequestModel {
        constructor (test) {
            this.isMockRequest = true;
            this.test = test;

            this.headers = [];

            this.actions = ACTIONS;

            [this.action] = this.actions;
            [this.data] = this.test.spec.availableMockRequests;

            this.url = '';
            this.passThrough = false;
            this.status = 200;
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        addHeader () {
            this.headers.push(new HeaderModel(this));
        }

        removeHeader (toRemove) {
            this.headers.splice(this.headers.indexOf(toRemove), 1);
        }

        _toAST () {
            let ast = astCreatorService;

            let data = {
                url: ast.literal(new RegExp(this.url))
            };
            let template = `
                step = step.then(function () {
                    return mockRequests.when${this.action}(%= url %, {
            `;
            if (this.passThrough) {
                template += 'passThrough: true';
            } else {
                if (this.data) {
                    data.dataName = ast.identifier(this.data.variableName);
                    template += 'body: <%= dataName %>,';
                }

                if (this.status && this.status !== 200) {
                    data.status = ast.literal(+this.status);
                    template += 'status: <%= status %>,';
                }

                if (this.headers.length) {
                    template += 'headers: {';
                    this.headers.forEach(header => template += header.ast + ',');
                    template += '}';
                }
            }
            template += `
                    });
                });
            `;

            return ast.template(template, data);
        }
    };
}

MochaSpecsModule.factory('SpecMockRequestModel', createMockRequestModelConstructor);
