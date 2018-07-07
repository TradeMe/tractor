// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import camelcase from 'camel-case';
import './action-argument';
import './value';

function createActionInstanceModelConstructor (
    ActionArgumentModel,
    ValueModel
) {
    return class ActionInstanceModel {
        constructor (interaction, action) {
            this.interaction = interaction;

            let { description, name, parameters, returns } = action;

            this.description = description;
            this.name = name;
            this.variableName = camelcase(this.name);

            this.arguments = this._getArguments(parameters);

            if (returns) {
                if (typeof returns === 'string') {
                    returns = { type: returns };
                }
                this.returns = new ValueModel(returns);
            }
        }

        _getArguments (parameters) {
            parameters = parameters || [];
            return parameters.map(parameter => new ActionArgumentModel(this.interaction, parameter));
        }
    };
}

PageObjectsModule.factory('ActionInstanceModel', createActionInstanceModelConstructor);
