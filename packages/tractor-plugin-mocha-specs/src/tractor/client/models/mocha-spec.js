// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import './meta/mocha-spec-meta';
import './test';

function createMochaSpecModelConstructor (
    TestModel,
    astCreatorService,
    pageObjectsService,
    plugins
) {
    return class MochaSpecModel {
        constructor (file) {
            this.file = file;

            this.plugins = pageObjectsService.getPluginPageObjects();

            this.name = '';

            this.tests = [];
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

        get suiteName () {
            return this._suiteName ? this._suiteName : this.name;
        }

        set suiteName (newSuiteName) {
            this._suiteName = newSuiteName;
        }

        addTest () {
            this.tests.push(new TestModel(this));
        }

        removeTest (toRemove) {
            this.tests.splice(this.tests.indexOf(toRemove), 1);
        }

        _toMeta () {
            return JSON.stringify({
                name: this.name,
                tests: this.tests.map(test => test.meta),
                version: this._getMochaSpecsVersion(plugins)
            });
        }

        _toAST () {
            let ast = astCreatorService;

            let name = ast.literal(this.suiteName);
            let tests = this.tests.map(test => test.ast);

            let template = `
                describe(<%= name %>, function () {
                    %= tests %;
                });
            `;
            return ast.file(ast.expression(template, { name, tests }), this.meta);
        }

        _getMochaSpecsVersion (plugins) {
            return this.version || plugins.find(plugin => plugin.name === 'Mocha Specs').version;
        }
    };
}

MochaSpecsModule.factory('MochaSpecModel', createMochaSpecModelConstructor);
