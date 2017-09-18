// Utilities:
import assert from 'assert';

// Module:
import { PageObjectsModule } from '../page-objects.module';

// Dependencies:
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

    function parse (pageObjectFile) {
        try {
            let ast = pageObjectFile.ast;
            let [firstComment] = ast.comments;
            var meta = JSON.parse(firstComment.value);

            let pageObject = new PageObjectModel({
                isSaved: true,
                url: pageObjectFile.url
            });
            pageObject.name = meta.name;
            let state = persistentStateService.get(pageObject.name);

            let [pageObjectModuleExpressionStatement] = ast.body;
            let moduleBlockStatement = pageObjectModuleExpressionStatement.expression.right.callee.body;

            moduleBlockStatement.body.forEach((statement, index) => {
                try {
                    assert(statement.argument.name);
                    return;
                } catch (e) { }

                try {
                    let [constructorDeclarator] = statement.declarations;
                    let constructorBlockStatement = constructorDeclarator.init.body;
                    constructorBlockStatement.body.forEach(statement => {
                        let domElement = elementParserService.parse(pageObject, statement);
                        assert(domElement);
                        domElement.name = meta.elements[pageObject.domElements.length].name;
                        domElement.minimised = !!state[domElement.name];
                        pageObject.elements.push(domElement);
                        pageObject.domElements.push(domElement);
                    });
                    return;
                } catch (e) { }

                try {
                    let actionMeta = meta.actions[pageObject.actions.length];
                    let action = actionParserService.parse(pageObject, statement, actionMeta);
                    assert(action);
                    action.name = actionMeta.name;
                    action.minimised = !!state[action.name];
                    pageObject.actions.push(action);
                    return;
                } catch (e) { }

                console.warn('Invalid Page Object:', statement, index);
            });

            return pageObject;
        } catch (e) {
            return new PageObjectModel();
        }
    }
}

PageObjectsModule.service('pageObjectParserService', PageObjectParserService);
