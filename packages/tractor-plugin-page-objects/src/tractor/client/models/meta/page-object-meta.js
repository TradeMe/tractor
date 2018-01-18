// Module:
import { PageObjectsModule } from '../../page-objects.module';

// Depenedencies:
import pascalcase from 'pascal-case';
import './action-meta';
import '../value';

function createPageObjectMetaModelConstructor (
    ActionMetaModel,
    ValueModel
) {
    return class PageObjectMetaModel {
        constructor (pageObject) {
            let { meta, url } = pageObject;

            this.actions = meta.actions.map(action => new ActionMetaModel({
                ...action,
                returns: 'promise'
            }));
            this.elements = meta.elements.map(element => new ValueModel(element));

            this.name = meta.name;
            this.url = url;
            this.variableName = pascalcase(this.name);
        }
    }
}

PageObjectsModule.factory('PageObjectMetaModel', createPageObjectMetaModelConstructor);
