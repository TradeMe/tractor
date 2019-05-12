// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Dependencies:
import { match, parse } from 'esquery';
import '../models/interaction';
import '../models/step';
import '../models/step-argument';
import './assertion-parser-service';
import './mock-request-parser-service';

// Queries:
const STEP_QUERY = parse('AssignmentExpression > CallExpression[callee.object.name="step"][callee.property.name="then"] > FunctionExpression > BlockStatement');
const PAGE_OBJECT_QUERY = parse('AssignmentExpression > Identifier[name!="element"]');
const SELECTOR_QUERY = parse('AssignmentExpression:has(MemberExpression[object.name="element"])');
const GROUP_SELECTOR_QUERY = parse('AssignmentExpression > CallExpression[callee.object.name="element"]');
const ELEMENT_SELECTOR_QUERY = parse('AssignmentExpression > MemberExpression[object.name="element"]');
const ASSERTION_QUERY = parse(`ReturnStatement > CallExpression > MemberExpression[property.name=/equal|contain/] > MemberExpression[property.name="eventually"] > MemberExpression[property.name="to"] > CallExpression[callee.name="expect"] > CallExpression`);
const INTERACTION_QUERY = parse('ReturnStatement > CallExpression[callee.object.name="element"]');
const MOCK_REQUEST_QUERY = parse('ReturnStatement > CallExpression[callee.object.name="mockRequests"]');

function StepParserService (
    SpecInteractionModel,
    SpecStepModel,
    StepArgumentModel,
    assertionParserService,
    mockRequestParserService,
    astCompareService
) {
    return { parse };

    function parse (test, astObject) {
        let step;
        let [result] = match(astObject, STEP_QUERY);
        if (result) {
            step = _stepParser(test, result);
        }

        let parsedCorrectly = astCompareService.compare(astObject, step.ast);
        if (!parsedCorrectly) {
            step.isUnparseable = astObject;
        }

        return step;
    }

    function _stepParser (test, astObject) {
        let step = new SpecStepModel(test);
        
        let [mockRequest] = match(astObject, MOCK_REQUEST_QUERY);
        if (mockRequest) {
            step = mockRequestParserService.parse(test, mockRequest);
            return step;
        }

        let [pageObject] = match(astObject, PAGE_OBJECT_QUERY);
        if (!pageObject) {
            return step;
        }

        let selectors = match(astObject, SELECTOR_QUERY);
        
        let [assertion] = match(astObject, ASSERTION_QUERY);
        if (assertion) {
            step = assertionParserService.parse(test, astObject);
            _parseStepPageObject(step, pageObject);
            selectors.forEach((selector, i) => _parseSelector(step, selector, i));
            _parseStepAction(step, assertion);
            return step;
        }

        let [interaction] = match(astObject, INTERACTION_QUERY);
        if (interaction) {
            step = new SpecInteractionModel(test);
            _parseStepPageObject(step, pageObject);
            selectors.forEach((selector, i) => _parseSelector(step, selector, i));
            _parseStepAction(step, interaction);
            return step;
        }

        return step;
    }

    function _parseStepPageObject (step, astObject) {
        step.pageObject = step.test.spec.availablePageObjects.find(pageObject => {
            return pageObject.instanceName === astObject.name;
        });
    }

    function _parseSelector (step, astObject, i) {
        let selector = step.selectors[i];
        if (!selector) {
            step.addSelector();
            selector = step.selectors[step.selectors.length - 1];
        }

        const [groupSelector] = match(astObject, GROUP_SELECTOR_QUERY);
        if (groupSelector) {
            selector.element = selector.parentElement.elements.find(element => {
                return element.variableName === groupSelector.callee.property.name;
            });
            const [selectorArgument] = groupSelector.arguments;
            selector.value = selectorArgument.value;    
            return;
        }

        const [elementSelector] = match(astObject, ELEMENT_SELECTOR_QUERY);
        if (elementSelector) {
            selector.element = selector.parentElement.elements.find(element => {
                return element.variableName === elementSelector.property.name;
            });
        }
    }

    function _parseStepAction (step, astObject) {
        step.action = step.elementType.actions.find(action => {
            return action.variableName === astObject.callee.property.name;
        });

        step.arguments = step.action.parameters.map((parameter, index) => {
            let argument = new StepArgumentModel(parameter);
            argument.value = astObject.arguments[index] ? astObject.arguments[index].value : null;
            return argument;
        });
    }
}

MochaSpecsModule.service('stepParserService', StepParserService);
