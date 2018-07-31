// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import * as path from 'path';
import './assertion';
import './interaction';
import './mock-request';

function createTestModelConstructor (
    SpecAssertionModel,
    SpecInteractionModel,
    SpecMockRequestModel,
    astCreatorService,
    mochaSpecsFileStructureService
) {
    return class TestModel {
        constructor (spec) {
            this.spec = spec;

            this.name = '';
            this.only = false;
            this.skip = false;
            this.reason = null;

            this.steps = [];
        }

        get ast () {
            return this.isUnparseable || this._toAST();
        }

        get data () {
            return this.ast;
        }

        get meta () {
            return this.name ? this._toMeta() : null;
        }

        addAssertion () {
            this.steps.push(new SpecAssertionModel(this));
        }

        addInteraction () {
            this.steps.push(new SpecInteractionModel(this));
        }

        addMockedRequest () {
            this.steps.push(new SpecMockRequestModel(this));
        }

        removeStep (toRemove) {
            this.steps.splice(this.steps.indexOf(toRemove), 1);
        }

        _toAST () {
            let ast = astCreatorService;

            let mockData = this._toMockDataASTs();
            let pageObjects = this._toPageObjectASTs();
            let name = ast.literal(this.name);
            let steps = this.steps.map(step => step.ast);

            let template = 'it';
            if (this.only) {
                template += '.only';
            }
            if (this.skip) {
                template += '.skip';
            }

            template += `(<%= name %>, function () {
                    %= mockData %;
                    %= pageObjects %;

                    var step = Promise.resolve();
                    %= steps %;
                    return step;
                });
            `;

            return ast.template(template, { mockData, name, pageObjects, steps });
        }

        _toMockDataASTs () {
            let ast = astCreatorService;

            let template = 'var <%= variableName %> = require(<%= url %>);';

            let mockRequests = Array.from(new Set(this.steps.filter(step => step.data).map(step => step.data)));
            return mockRequests.map(mockRequest => {
                let variableName = ast.identifier(mockRequest.variableName);
                let url = ast.literal(this._getRelativePath(mockRequest));
                return ast.expression(template, { variableName, url });
            });
        }

        _toPageObjectASTs () {
            let ast = astCreatorService;

            let template = 'var <%= variableName %> = require(<%= url %>), <%= instanceName %> = new <%= variableName %> ();';

            let pageObjects = this.steps
                .filter(step => step.pageObject)
                .map(step => step.pageObject)
                .filter(pageObject => !pageObject.isPlugin);
            return Array.from(new Set(pageObjects)).map(pageObject => {
                let variableName = ast.identifier(pageObject.variableName);
                let instanceName = ast.identifier(pageObject.instanceName);
                let url = ast.literal(this._getRelativePath(pageObject));
                return ast.expression(template, { instanceName, url, variableName });
            });
        }

        _toMeta () {
            let meta = {
                name: this.name
            };
            if (this.skip) {
                meta.reason = this.reason;
            }
            return meta;
        }

        _getRelativePath (file) {
            let directory = this.spec.file ? path.dirname(this.spec.file.path) : mochaSpecsFileStructureService.fileStructure.path;
            let relative = path.relative(directory, file.path);
            if (!relative.match(/^\./)) {
                relative = `./${relative}`;
            }
            return relative;
        }
    };
}

MochaSpecsModule.factory('TestModel', createTestModelConstructor);
