// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../deprecated/element-parser.service';
import '../models/element';

// Queries:
const SELECTOR_QUERY = parse('CallExpression[callee.object.name="by"][callee.property.name="css"] > Literal');
const ELEMENT_QUERY = parse(`AssignmentExpression > CallExpression[callee.name="find"]`);
const ELEMENT_MULTIPLE_QUERY = parse('AssignmentExpression > FunctionExpression ReturnStatement > CallExpression[callee.object.callee.name="findAll"]');
const PAGE_OBJECT_QUERY = parse('AssignmentExpression > NewExpression[arguments.0.callee.name="find"]');
const PAGE_OBJECT_MULTIPLE_QUERY = parse('AssignmentExpression > FunctionExpression ReturnStatement > NewExpression');

function ElementParserService (
    ElementModel,
    astCompareService,
    deprecatedElementParserService
) {
    const QUERY_SELECTOR = {
        element: ELEMENT_QUERY,
        elementMultiple: ELEMENT_MULTIPLE_QUERY,
        pageObject: PAGE_OBJECT_QUERY,
        pageObjectMultiple: PAGE_OBJECT_MULTIPLE_QUERY
    };
    const QUERY_HANDLER = {
        element: _elementParser,
        elementMultiple: _elementMultipleParser,
        pageObject: _pageObjectParser,
        pageObjectMultiple: _pageObjectMultipleParser
    };

    return { parse };

    function parse (pageObject, astObject, meta = {}) {
        let element = new ElementModel(pageObject);
        element.name = meta.name;

        Object.keys(QUERY_SELECTOR).find(key => {
            let [result] = match(astObject, QUERY_SELECTOR[key]);
            if (result) {
                QUERY_HANDLER[key](element, result);
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
        let [selector] = match(astObject, SELECTOR_QUERY);
        if (selector) {
            _selectorParser(element, selector);
        }
    }

    function _elementMultipleParser (element, astObject) {
        element.group = true;
        _elementParser(element, astObject);
    }

    function _pageObjectParser (element, astObject) {
        let [selector] = match(astObject, SELECTOR_QUERY);
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
