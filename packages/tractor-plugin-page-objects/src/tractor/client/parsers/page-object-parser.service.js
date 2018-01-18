// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const PAGE_OBJECT_QUERY = 'AssignmentExpression[left.object.name="module"] > CallExpression > FunctionExpression > BlockStatement';
const ELEMENTS_QUERY = `${PAGE_OBJECT_QUERY} > VariableDeclaration > VariableDeclarator > FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression[left.property]`;
const ACTIONS_QUERY = `${PAGE_OBJECT_QUERY} > ExpressionStatement > AssignmentExpression[left.property]`;

// Dependencies:
import assert from 'assert';
import esquery from 'esquery';
import '../models/page-object';
import './action-parser.service';
import './element-parser.service';

function PageObjectParserService (
    PageObjectModel,
    actionParserService,
    elementParserService,
    persistentStateService
) {
    return { parse };

    function parse (pageObjectFile, availablePageObjects) {
        let pageObject = new PageObjectModel(pageObjectFile);

        try {
            let astObject = pageObjectFile.ast;
            let [metaComment] = astObject.comments;
            var meta = JSON.parse(metaComment.value);

            pageObject.name = meta.name;
            pageObject.availablePageObjects = availablePageObjects.filter(availablePageObject => {
                return availablePageObject.name !== pageObject.name;
            });

            let state = persistentStateService.get(pageObject.name);

            let elements = esquery(astObject, ELEMENTS_QUERY);
            elements.forEach(elementASTObject => {
                let elementMeta = meta.elements[pageObject.domElements.length];
                assert(elementMeta.name, `
                    Could not find meta-data for element "${elementASTObject.left.property.name}" of page object "${pageObject.name}".
                `);
                let domElement = elementParserService.parse(pageObject, elementASTObject, elementMeta);
                assert(domElement);
                domElement.minimised = !!state[domElement.name];
                pageObject.elements.push(domElement);
                pageObject.domElements.push(domElement);
            });

            let actions = esquery(astObject, ACTIONS_QUERY);
            actions.forEach(actionASTObject => {
                let actionMeta = meta.actions[pageObject.actions.length];
                assert(actionMeta.name, `
                    Could not find meta-data for action "${actionASTObject.left.property.name}" of page object "${pageObject.name}".
                `);
                let action = actionParserService.parse(pageObject, actionASTObject, actionMeta);
                assert(action);
                action.minimised = !!state[action.name];
                pageObject.actions.push(action);
            });

            return pageObject;
        } catch (e) {
            pageObject.couldNotParse = e;
        }
    }
}

PageObjectsModule.service('pageObjectParserService', PageObjectParserService);
