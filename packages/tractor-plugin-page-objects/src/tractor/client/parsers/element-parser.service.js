// Utilities:
import assert from 'assert';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import '../models/element';
import './filter-parser.service';

function ElementParserService (
    ElementModel,
    filterParserService
) {
    return { parse };

    function parse (pageObject, astObject, element) {
        if (!element) {
            element = new ElementModel(pageObject);
        }

        let elementCallExpression = astObject.expression.right;
        let elementCallExpressionCallee = elementCallExpression.callee;

        try {
            assert(elementCallExpressionCallee.object.callee);
            try {
                assert(elementCallExpressionCallee.object.callee.property.name === 'filter');
                elementCallExpressionCallee = elementCallExpressionCallee.object.callee;
                elementCallExpression = elementCallExpression.callee.object;
            // eslint-disable-next-line no-empty
            } catch (e) { }

            parse(pageObject, {
                expression: {
                    right: elementCallExpressionCallee.object
                }
            }, element);
        // eslint-disable-next-line no-empty
        } catch (e) { }

        let notFirstElementBy = false;
        let notFirstElementAllBy = false;
        let notElementBy = false;
        let notElementAllBy = false;
        let notElementFilter = false;
        let notElementGet = false;

        try {
            assert(elementCallExpressionCallee.name === 'element');
            let [filterAST] = elementCallExpression.arguments;
            let filter = filterParserService.parse(element, filterAST);
            element.addFilter(filter);
        } catch (e) {
            notFirstElementBy = true;
        }

        try {
            if (notFirstElementBy) {
                assert(elementCallExpressionCallee.object.name === 'element');
                assert(elementCallExpressionCallee.property.name === 'all');
                let [filterAllAST] = elementCallExpression.arguments;
                let filter = filterParserService.parse(element, filterAllAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notFirstElementAllBy = true;
        }

        try {
            if (notFirstElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'element');
                let [filterAST] = elementCallExpression.arguments;
                let filter = filterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementBy = true;
        }

        try {
            if (notElementBy) {
                assert(elementCallExpressionCallee.property.name === 'all');
                let [filterAllAST] = elementCallExpression.arguments;
                let filter = filterParserService.parse(element, filterAllAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementAllBy = true;
        }

        try {
            if (notElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'filter');
                let [filterAST] = elementCallExpression.arguments;
                let filter = filterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementFilter = true;
        }

        try {
            if (notElementFilter) {
                assert(elementCallExpressionCallee.property.name === 'get');
                let [filterAST] = elementCallExpression.arguments;
                let filter = filterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementGet = true;
        }

        if (notFirstElementBy && notFirstElementAllBy && notElementBy && notElementAllBy && notElementFilter && notElementGet) {
            // eslint-disable-next-line no-console
            console.log(astObject);
        }

        return element;
    }
}

PageObjectsModule.service('elementParserService', ElementParserService);
