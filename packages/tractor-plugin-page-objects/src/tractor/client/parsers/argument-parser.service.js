// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/argument';

function POArgumentParserService (
    POArgumentModel
) {
    return { parse };

    function parse (interaction, argument, astObject) {
        argument = new POArgumentModel(interaction, argument);

        let value = astObject.name;
        value = !_isUndefined(value) ? value : astObject.value;
        value = !_isUndefined(value) ? value : astObject.property.name;

        let { containingAction, previousInteraction } = interaction;
        let { pageObject, parameters } = containingAction;

        let returns;
        if (previousInteraction) {
            returns = previousInteraction.action.returns;
        }

        let parameter = parameters.find(parameter => parameter.variableName === value);
        let result = returns && returns.variableName === value ? returns : null;
        let element = pageObject.domElements.find(element => element.variableName === value);

        if (parameter) {
            value = parameter.name;
        } else if (result) {
            value = returns.name;
        } else if (element) {
            value = element.name;
        }

        argument.value = value;

        return argument;
    }

    function _isUndefined (value) {
        return typeof value === 'undefined';
    }
}

PageObjectsModule.service('poargumentParserService', POArgumentParserService);
