// Module:
import { PageObjectsModule } from '../../page-objects.module';

// Depenedencies:
import camelcase from 'camel-case';
import pascalcase from 'pascal-case';
import './action-meta';
import '../value';

function createPageObjectMetaModelConstructor (
    ActionMetaModel,
    ValueModel
) {
    return class PageObjectMetaModel {
        constructor (pageObject, options = {}) {
            let { meta, path, url } = pageObject;
            let { includeName, isPlugin } = options;

            this.actions = meta.actions.map(action => new ActionMetaModel({
                ...action,
                returns: 'promise'
            }));
            this.elements = meta.elements.map(element => new ValueModel(element));
            this.elementGroups = this.elements.filter(element => element.type);

            this.name = meta.name;
            this.path = path;
            this.url = url;
            this.variableName = pascalcase(this.name);
            this.instanceName = camelcase(this.name);

            this.isIncluded = !!includeName;
            this.isPlugin = !!isPlugin;
            this.displayName = this.isIncluded ? `${includeName} - ${this.name}` : this.name;
        }
    };
}

PageObjectsModule.factory('PageObjectMetaModel', createPageObjectMetaModelConstructor);
