// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const SELECTOR_QUERY = 'CallExpression[callee.object.name="by"][callee.property.name="css"] > Literal';
const ELEMENT_QUERY = `AssignmentExpression > CallExpression[callee.name="find"]`;
const ELEMENT_MULTIPLE_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement > CallExpression[callee.object.callee.object.name="find"][callee.object.callee.property.name="all"]';
const PAGE_OBJECT_QUERY = 'AssignmentExpression > NewExpression[arguments.0.callee.name="find"]';
const PAGE_OBJECT_MULTIPLE_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement > NewExpression';

// Dependencies:
import esquery from 'esquery';
import '../deprecated/element-parser.service';
import '../models/element';

function ElementParserService (
    ElementModel,
    deprecatedElementParserService
) {
    const QUERIES = {
        [ELEMENT_QUERY]: _elementParser,
        [ELEMENT_MULTIPLE_QUERY]: _elementMultipleParser,
        [PAGE_OBJECT_QUERY]: _pageObjectParser,
        [PAGE_OBJECT_MULTIPLE_QUERY]: _pageObjectMultipleParser,
    };

    return { parse };

    function parse (pageObject, astObject, meta) {
        let element = new ElementModel(pageObject);
        element.name = meta.name;

        let match = Object.keys(QUERIES).find(query => {
            let [result] = esquery(astObject, query);
            if (result) {
                QUERIES[query](element, result);
                return element;
            }
        });

        if (match) {
            return element;
        }
        return deprecatedElementParserService.parse(pageObject, astObject, meta);
    }

    function _selectorParser (element, astObject) {
        element.selector = astObject.value;
    }

    function _elementParser (element, astObject) {
        let [selector] = esquery(astObject, SELECTOR_QUERY);
        _selectorParser(element, selector);
    }

    function _elementMultipleParser (element, astObject) {
        element.isMultiple = true;
        _elementParser(element, astObject);
    }

    function _pageObjectParser (element, astObject) {
        let [selector] = esquery(astObject, SELECTOR_QUERY);
        _selectorParser(element, selector);

        element.type = element.pageObject.availablePageObjects.find(pageObject => {
            return pageObject.variableName === astObject.callee.name
        });
        element.actions = element.type.actions;
    }

    function _pageObjectMultipleParser (element, astObject) {
        element.isMultiple = true;
        _pageObjectParser(element, astObject);
    }
}

PageObjectsModule.service('elementParserService', ElementParserService);
