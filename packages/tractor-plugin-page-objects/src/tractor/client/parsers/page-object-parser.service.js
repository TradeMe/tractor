// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const PAGE_OBJECT_QUERY = 'AssignmentExpression[left.object.name="module"] > CallExpression > FunctionExpression > BlockStatement';
const ELEMENTS_QUERY = `${PAGE_OBJECT_QUERY} > VariableDeclaration > VariableDeclarator > FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression[left.property]`;
const ACTIONS_QUERY = `${PAGE_OBJECT_QUERY} > ExpressionStatement > AssignmentExpression[left.property]`;

// Dependencies:
import esquery from 'esquery';
import '../models/page-object';
import './action-parser.service';
import './element-parser.service';

function PageObjectParserService (
    PageObjectModel,
    actionParserService,
    astCompareService,
    elementParserService,
    persistentStateService
) {
    return { parse };

    function parse (pageObjectFile, availablePageObjects) {
        let pageObject = new PageObjectModel(pageObjectFile);
        pageObject.name = pageObjectFile.name;

        let astObject = pageObjectFile.ast;

        let meta;
        try {
            let [metaComment] = astObject.comments;
            meta = JSON.parse(metaComment.value);
        } catch (e) {
            // If we can't parse the meta comment, we just bail straight away:
            pageObject.isUnparseable = astObject;
            return pageObject;
        }

        pageObject.name = meta.name;
        pageObject.version = meta.version;
        pageObject.availablePageObjects = availablePageObjects.filter(availablePageObject => {
            return availablePageObject.name !== pageObject.name;
        });

        let state = persistentStateService.get(pageObject.name);

        let elements = esquery(astObject, ELEMENTS_QUERY);
        elements.forEach(elementASTObject => {
            let elementMeta = meta.elements[pageObject.domElements.length];
            let domElement = elementParserService.parse(pageObject, elementASTObject, elementMeta);
            domElement.minimised = !!state[domElement.name];
            pageObject.elements.push(domElement);
            pageObject.domElements.push(domElement);
        });

        let actions = esquery(astObject, ACTIONS_QUERY);
        actions.forEach(actionASTObject => {
            let actionMeta = meta.actions[pageObject.actions.length];
            let action = actionParserService.parse(pageObject, actionASTObject, actionMeta);
            action.minimised = !!state[action.name];
            pageObject.actions.push(action);
        });

        let parsedCorrectly = astCompareService.compare(astObject, pageObject.ast);
        if (!parsedCorrectly) {
            pageObject.isUnparseable = astObject;
            if (meta.version !== pageObject.version) {
                pageObject.outdated = true;
            }
        }

        return pageObject;
    }
}

PageObjectsModule.service('pageObjectParserService', PageObjectParserService);
