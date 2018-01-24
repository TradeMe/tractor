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
        constructor (pageObject, includeName) {
            let { meta, path } = pageObject;

            this.actions = meta.actions.map(action => new ActionMetaModel({
                ...action,
                returns: 'promise'
            }));
            this.elements = meta.elements.map(element => new ValueModel(element));

            this.name = meta.name;
            this.path = path;
            this.variableName = pascalcase(this.name);

            this.isIncluded = !!includeName;
            this.displayName = this.isIncluded ? `${includeName} - ${this.name}` : this.name;
        }
    }
}

PageObjectsModule.factory('PageObjectMetaModel', createPageObjectMetaModelConstructor);
