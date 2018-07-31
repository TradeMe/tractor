// Module:
import { MochaSpecsModule } from '../mocha-specs.module';

// Queries:
const STEP_QUERY = 'AssignmentExpression > CallExpression[callee.object.name="step"][callee.property.name="then"] > FunctionExpression > BlockStatement';
const PAGE_OBJECT_QUERY = 'AssignmentExpression > Identifier[name!="element"]';
const SELECTOR_QUERY = 'AssignmentExpression > CallExpression[callee.object.name="element"]';
const ASSERTION_QUERY = `ReturnStatement > CallExpression > MemberExpression[property.name=/equal|contain/] > MemberExpression[property.name="eventually"] > MemberExpression[property.name="to"] > CallExpression[callee.name="expect"] > CallExpression`;
const INTERACTION_QUERY = 'ReturnStatement > CallExpression[callee.object.name="element"]';
const MOCK_REQUEST_QUERY = 'ReturnStatement > CallExpression[callee.object.name="mockRequests"]';

// Dependencies:
import esquery from 'esquery';
import '../models/interaction';
import '../models/step';
import '../models/step-argument';
import './assertion-parser-service';
import './mock-request-parser-service';

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
        let [result] = esquery(astObject, STEP_QUERY);
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

        let [pageObject] = esquery(astObject, PAGE_OBJECT_QUERY);
        if (!pageObject) {
            return step;
        }

        let selectors = esquery(astObject, SELECTOR_QUERY);
        
        let [assertion] = esquery(astObject, ASSERTION_QUERY);
        if (assertion) {
            step = assertionParserService.parse(test, astObject);
            _parseStepPageObject(step, pageObject);
            selectors.forEach(selector => _parseSelector(step, selector));
            _parseStepAction(step, assertion);
            return step;
        }

        let [interaction] = esquery(astObject, INTERACTION_QUERY);
        if (interaction) {
            step = new SpecInteractionModel(test);
            _parseStepPageObject(step, pageObject);
            selectors.forEach(selector => _parseSelector(step, selector));
            _parseStepAction(step, interaction);
            return step;
        }
        
        let [mockRequest] = esquery(astObject, MOCK_REQUEST_QUERY);
        if (mockRequest) {
            step = mockRequestParserService.parse(test, mockRequest);
            return step;
        }

        return step;
    }

    function _parseStepPageObject (step, astObject) {
        step.pageObject = step.test.spec.availablePageObjects.find(pageObject => {
            return pageObject.instanceName === astObject.name;
        });
    }

    function _parseSelector (step, astObject) {
        step.addSelector();
        const selector = step.selectors[step.selectors.length - 1];
        selector.elementGroup = selector.parentElementType.elementGroups.find(elementGroup => {
            return elementGroup.name === astObject.callee.property.name;
        });
        const [selectorArgument] = astObject.arguments;
        selector.value = selectorArgument.value;
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
