// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import assert from 'assert';
import './filter';

function DeprecatedFilterParserService (
    DeprecatedFilterModel
) {
    return { parse };

    function parse (element, astObject) {
        let filter = new DeprecatedFilterModel(element);

        let notModelBindingCSSOptionsRepeater = false;
        let notText = false;
        let notAllIndex = false;
        let notAllString = false;

        try {
            assert(astObject.callee.property.name !== 'cssContainingText');
            let [locatorLiteral] = astObject.arguments;
            filter.locator = locatorLiteral.value;
            filter.selector = astObject.callee.property.name;
        } catch (e) {
            notModelBindingCSSOptionsRepeater = true;
        }

        try {
            if (notModelBindingCSSOptionsRepeater) {
                assert(astObject.callee.property.name === 'cssContainingText');
                let args = astObject.arguments;
                let cssSelector = args[0].value;
                assert(cssSelector);
                let searchString = args[1].value;
                assert(searchString);
                let locatorLiteral = cssSelector + ',' +  searchString;
                filter.locator = locatorLiteral;
                filter.selector = 'text';
            }
        } catch (e) {
            notText = true;
        }

        try {
            if (notText) {
                assert(typeof astObject.value === 'number');
                filter.locator = '' + astObject.value;
                filter.selector = 'text';
            }
        } catch (e) {
            notAllIndex = true;
        }

        try {
            if (notAllIndex) {
                let [getTextThenReturnStatement] = astObject.body.body;
                let [checkFoundTextFunctionExpression] = getTextThenReturnStatement.argument.arguments;
                let [checkFoundTextReturnStatement] = checkFoundTextFunctionExpression.body.body;
                let [locatorLiteral] = checkFoundTextReturnStatement.argument.left.arguments;
                filter.locator = locatorLiteral.value;
                filter.selector = 'text';
            }
        } catch (e) {
            notAllString = true;
        }

        if (notModelBindingCSSOptionsRepeater && notText && notAllIndex && notAllString) {
            filter.unparseable = astObject;
        }

        return filter;
    }
}

PageObjectsModule.service('deprecatedFilterParserService', DeprecatedFilterParserService);
