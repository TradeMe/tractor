// Module:
import { PageObjectsModule } from '../../page-objects.module';

// Depenedencies:
import camelcase from 'camel-case';
import '../value';

function createActionMetaModelConstructor (
    ValueModel
) {
    return class ActionMetaModel {
        constructor (meta) {
            let { description, name, parameters, returns } = meta;

            this.description = description;
            this.name = name;
            this.variableName = camelcase(this.name);

            this.parameters = this._getParameters(parameters);

            if (returns) {
                if (typeof returns === 'string') {
                    returns = { type: returns };
                }
                this.returns = new ValueModel(returns);
            }
        }

        _getParameters (parameters) {
            parameters = parameters || [];
            return parameters.map(parameter => new ValueModel(parameter));
        }
    }
}

PageObjectsModule.factory('ActionMetaModel', createActionMetaModelConstructor);
