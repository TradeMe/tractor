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
            let { basename, meta, path, url } = pageObject;
            let { includeName, isPlugin } = options;
            
            // `meta` may not exist if this is an empty, brand new .po.js file:
            if (!meta) {
                this.name = basename;
                this.actions = [];
                this.elements = [];
            }

            this.name = this.name || meta.name;
            this.path = path;
            this.url = url;
            this.variableName = pascalcase(this.name);
            this.instanceName = camelcase(this.name);

            this.actions = this.actions || meta.actions.map(action => new ActionMetaModel({
                ...action,
                returns: 'promise'
            }));
            this.elements = this.elements || meta.elements.map(element => new ValueModel(element));

            this.elementsWithType = this.elements.filter((_, i) => meta.elements[i].type);
            this.elementGroups = this.elements.filter((_, i) => meta.elements[i].group);

            this.isIncluded = !!includeName;
            this.isPlugin = !!isPlugin;
            this.displayName = this.isIncluded ? `${includeName} - ${this.name}` : this.name;
        }
    };
}

PageObjectsModule.factory('PageObjectMetaModel', createPageObjectMetaModelConstructor);
