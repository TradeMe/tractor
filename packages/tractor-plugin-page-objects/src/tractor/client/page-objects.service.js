// Module:
import { PageObjectsModule } from './page-objects.module';

// Dependencies:
import Promise from 'bluebird';

PageObjectsModule.factory('pageObjectsService', (
    config,
    plugins,
    fileStructureServiceFactory,
    pageObjectFileStructureService,
    PageObjectMetaModel
) => {
    let includePageObjectsFileStructureServices = {};
    Object.keys(config.pageObjects.include).forEach(include => {
        includePageObjectsFileStructureServices[include] = fileStructureServiceFactory(`page-objects/${include}`);
    });

    return {
        createPageObjectMetaModels,
        getAvailablePageObjects,
        getPluginPageObjects
    };

    function createPageObjectMetaModels (fileStructure, includeName) {
        return fileStructure.fileStructure.allFiles.filter(file =>  file.extension === '.po.js')
        .map(file => new PageObjectMetaModel(file, includeName));
    }

    function getAvailablePageObjects () {
        return Promise.all([
            _getLocalPageObjects(),
            _getIncludedPageObjects()
        ])
        .then(([local, included]) => local.concat(included));
    }

    function getPluginPageObjects () {
        return plugins.slice(0)
        .filter(plugin => plugin.actions && plugin.actions.length)
        .map(plugin => {
            let { actions, name } = plugin;
            plugin.meta = { actions, elements: [], name };
            return new PageObjectMetaModel(plugin);
        });
    }

    function _getLocalPageObjects () {
        return pageObjectFileStructureService.getFileStructure()
        .then(() => createPageObjectMetaModels(pageObjectFileStructureService));
    }

    function _getIncludedPageObjects () {
        let includeNames = Object.keys(includePageObjectsFileStructureServices);
        return Promise.map(includeNames, includeName => {
            return includePageObjectsFileStructureServices[includeName].getFileStructure();
        })
        .then(() => {
            return includeNames.map(includeName => {
                let fileStructureService = includePageObjectsFileStructureServices[includeName];
                return createPageObjectMetaModels(fileStructureService, includeName);
            // Flatten:
            }).reduce((p, n) => p.concat(n), []);
        });
    }
});
