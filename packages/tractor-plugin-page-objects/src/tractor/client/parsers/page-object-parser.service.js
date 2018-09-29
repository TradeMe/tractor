// Module:
import { PageObjectsModule } from '../page-objects.module';

// Queries:
const PAGE_OBJECT_QUERY = 'AssignmentExpression[left.object.name="module"] > CallExpression > FunctionExpression > BlockStatement';
const ELEMENTS_QUERY = `${PAGE_OBJECT_QUERY} > VariableDeclaration > VariableDeclarator > FunctionExpression > BlockStatement > ExpressionStatement > AssignmentExpression[left.property]:has(CallExpression)`;
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
    persistentStateService,
    plugins
) {
    return { parse };

    function parse (pageObjectFile, availablePageObjects, isIncluded) {
        let pageObject = new PageObjectModel(pageObjectFile);
        pageObject.name = pageObjectFile.basename;
        pageObject.isIncluded = isIncluded;

        let astObject = pageObjectFile.ast;

        // If this is a brand new, empty .po.js file, the AST will be empty:
        const isNewFile = isEmptyAST(astObject);

        let meta;
        if (!isNewFile) {
            try {
                let [metaComment] = astObject.comments;
                meta = JSON.parse(metaComment.value);
            } catch (e) {
                // If we can't parse the meta comment, we just bail straight away:
                pageObject.isUnparseable = astObject;
                return pageObject;
            }
        }

        const actions = isNewFile ? [] : meta.actions;
        const elements = isNewFile ? [] : meta.elements;
        const name = isNewFile ? pageObject.name : meta.name;
        const version = isNewFile ? _getPageObjectsVersion(plugins) : meta.version;

        pageObject.name = name;
        pageObject.version = version;
        pageObject.availablePageObjects = availablePageObjects.filter(availablePageObject => {
            return availablePageObject.name !== pageObject.name;
        });

        let state = persistentStateService.get(pageObject.name);

        esquery(astObject, ELEMENTS_QUERY).forEach(elementASTObject => {
            let elementMeta = elements[pageObject.domElements.length];
            let domElement = elementParserService.parse(pageObject, elementASTObject, elementMeta);
            domElement.minimised = !!state[domElement.name];
            pageObject.elements.push(domElement);
            pageObject.domElements.push(domElement);
        });

        esquery(astObject, ACTIONS_QUERY).forEach(actionASTObject => {
            let actionMeta = actions[pageObject.actions.length];
            let action = actionParserService.parse(pageObject, actionASTObject, actionMeta);
            action.minimised = !!state[action.name];
            pageObject.actions.push(action);
        });

        let parsedCorrectly = isNewFile || astCompareService.compare(astObject, pageObject.ast);
        if (!parsedCorrectly) {
            pageObject.isUnparseable = astObject;
            if (version !== pageObject.version) {
                pageObject.outdated = true;
            }
        }

        return pageObject;
    }

    function isEmptyAST (ast) {
        return ast.body.length === 0 && ast.comments.length === 0;
    }

    function _getPageObjectsVersion (plugins) {
        return plugins.find(plugin => plugin.name === 'Page Objects').version;
    }
}

PageObjectsModule.service('pageObjectParserService', PageObjectParserService);
