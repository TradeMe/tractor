// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const SELECTOR_QUERY = 'CallExpression[callee.object.name="by"][callee.property.name="css"] > Literal';
const ELEMENT_QUERY = `AssignmentExpression > CallExpression[callee.name="find"]`;
const ELEMENT_MULTIPLE_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement > CallExpression[callee.object.callee.name="findAll"]';
const PAGE_OBJECT_QUERY = 'AssignmentExpression > NewExpression[arguments.0.callee.name="find"]';
const PAGE_OBJECT_MULTIPLE_QUERY = 'AssignmentExpression > FunctionExpression ReturnStatement > NewExpression';

// Dependencies:
import esquery from 'esquery';
import '../deprecated/element-parser.service';
import '../models/element';

function ElementParserService (
    ElementModel,
    astCompareService,
    deprecatedElementParserService
) {
    const QUERIES = {
        [ELEMENT_QUERY]: _elementParser,
        [ELEMENT_MULTIPLE_QUERY]: _elementMultipleParser,
        [PAGE_OBJECT_QUERY]: _pageObjectParser,
        [PAGE_OBJECT_MULTIPLE_QUERY]: _pageObjectMultipleParser,
    };

    return { parse };

    function parse (pageObject, astObject, meta = {}) {
        let element = new ElementModel(pageObject);
        element.name = meta.name;

        Object.keys(QUERIES).find(query => {
            let [result] = esquery(astObject, query);
            if (result) {
                QUERIES[query](element, result);
                return element;
            }
        });

        // Here we return if we parsed correctly, otherwise attempt to use the
        // deprecatedElementParserService.
        //
        // If the deprecatedElementParserService also fails, the action will be marked
        // as unparseable.
        let parsedCorrectly = astCompareService.compare(astObject, element.ast);
        if (parsedCorrectly) {
            return element;
        }

        return deprecatedElementParserService.parse(pageObject, astObject, meta);
    }

    function _selectorParser (element, astObject) {
        element.selector = astObject.value;
    }

    function _elementParser (element, astObject) {
        let [selector] = esquery(astObject, SELECTOR_QUERY);
        if (selector) {
            _selectorParser(element, selector);
        }
    }

    function _elementMultipleParser (element, astObject) {
        element.group = true;
        _elementParser(element, astObject);
    }

    function _pageObjectParser (element, astObject) {
        let [selector] = esquery(astObject, SELECTOR_QUERY);
        if (selector) {
            _selectorParser(element, selector);
        }

        element.type = element.pageObject.availablePageObjects.find(pageObject => {
            return pageObject.variableName === astObject.callee.name;
        });
        if (element.type) {
            element.actions = element.type.actions;
        }
    }

    function _pageObjectMultipleParser (element, astObject) {
        element.group = true;
        _pageObjectParser(element, astObject);
    }
}

PageObjectsModule.service('elementParserService', ElementParserService);
