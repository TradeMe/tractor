// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';
import './interaction';
import './value';

function createActionModelConstructor (
    astCreatorService,
    InteractionModel,
    ValueModel
) {
    let ast = astCreatorService;

    return class ActionModel {
        constructor (pageObject) {
            this.pageObject = pageObject;
            this.interactions = [];
            this.parameters = [];
            this.name = '';
        }

        get ast () {
            return this.unparseable || this._toAST();
        }

        get meta () {
            return this.name ? this._toMeta() : null;
        }

        get variableName () {
            return camelcase(this.name);
        }

        get lastInteraction () {
            return this.interactions[this.interactions.length - 1]
        }

        addParameter () {
            this.parameters.push(new ValueModel({ name: '' }));
        }

        removeParameter (toRemove) {
            if (this.parameters.includes(toRemove)) {
                this.parameters.splice(this.parameters.indexOf(toRemove), 1);
            }
        }

        addInteraction () {
            let interaction = new InteractionModel(this, this.lastInteraction);
            interaction.element = this.pageObject.browser;
            this.interactions.push(interaction);
        }

        removeInteraction (toRemove) {
            if (this.interactions.includes(toRemove)) {
                this.interactions.splice(this.interactions.indexOf(toRemove), 1);
            }
        }

        _toAST () {
            let action = ast.identifier(this.variableName);
            let interactions = this.interactions.map(interaction => interaction.ast);
            let pageObject = ast.identifier(this.pageObject.variableName);
            let parameters = this.parameters.map(parameter => parameter.ast);

            let template = '<%= pageObject %>.prototype.<%= action %> = function (%= parameters %) {';
            if (interactions.length) {
                template += `
                    var self = this;
                    var result = Promise.resolve();
                    %= interactions %;
                    return result;
                `;
            }
            template += '};';

            return ast.expression(template, { action, interactions, pageObject, parameters });
        }

        _toMeta () {
            return {
                name: this.name,
                parameters: this.parameters
                    .map(parameter => parameter.meta)
                    .filter(Boolean)
            };
        }
    }
}

PageObjectsModule.factory('ActionModel', createActionModelConstructor);
