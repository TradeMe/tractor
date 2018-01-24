// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/action-argument';

function ActionArgumentParserService (
    ActionArgumentModel,
    astCompareService
) {
    return { parse };

    function parse (interaction, argument, astObject) {
        argument = new ActionArgumentModel(interaction, argument);

        let value = _getValue(astObject);

        let { containingAction, previousInteraction } = interaction;
        let { pageObject, parameters } = containingAction;
        let returns = previousInteraction ? previousInteraction.action.returns : null;

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

        let parsedCorrectly = astCompareService.compare(astObject, argument.ast);
        if (!parsedCorrectly) {
            argument.unparseable = astObject;
        }

        return argument;
    }

    function _getValue (astObject) {
        let value = astObject.name;
        value = !_isUndefined(value) ? value : astObject.value;
        value = !_isUndefined(value) ? value : astObject.property && astObject.property.name;
        return value;
    }

    function _isUndefined (value) {
        return typeof value === 'undefined';
    }
}

PageObjectsModule.service('actionArgumentParserService', ActionArgumentParserService);
