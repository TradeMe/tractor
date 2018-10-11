// Module:
import { PageObjectsModule } from './page-objects.module';

PageObjectsModule.factory('pageObjectsService', (
    config,
    plugins,
    fileStructureServiceFactory,
    pageObjectFileStructureService,
    PageObjectMetaModel
) => {
    let includePageObjectsFileStructureServices = {};
    Object.keys(config.pageObjects.include).forEach(includeName => {
        let fileStructureService = fileStructureServiceFactory(`included-page-objects/${includeName}`);
        fileStructureService.isIncluded = true;
        includePageObjectsFileStructureServices[includeName] = fileStructureService;
    });

    return {
        getAvailablePageObjects,
        getPluginPageObjects,
        getPageObjectFileStructureService
    };

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
            return new PageObjectMetaModel(plugin, { isPlugin: true });
        });
    }

    function getPageObjectFileStructureService (file) {
        let includeName = Object.keys(config.pageObjects.include).find(includeName => {
            return file.url.startsWith(`/included-page-objects/${includeName}`);
        });
        return includeName ? includePageObjectsFileStructureServices[includeName] : pageObjectFileStructureService;
    }

    function _createPageObjectMetaModels (fileStructure, includeName) {
        return fileStructure.fileStructure.allFiles.filter(file =>  file.extension === '.po.js')
        .map(file => new PageObjectMetaModel(file, { includeName }));
    }

    function _getLocalPageObjects () {
        return pageObjectFileStructureService.getFileStructure()
        .then(() => _createPageObjectMetaModels(pageObjectFileStructureService));
    }

    function _getIncludedPageObjects () {
        let includeNames = Object.keys(includePageObjectsFileStructureServices);
        return Promise.all(includeNames.map(includeName => {
            return includePageObjectsFileStructureServices[includeName].getFileStructure();
        }))
        .then(() => {
            return includeNames.map(includeName => {
                let fileStructureService = includePageObjectsFileStructureServices[includeName];
                return _createPageObjectMetaModels(fileStructureService, includeName);
            })
            // Flatten:
            .reduce((p, n) => p.concat(n), []);
        });
    }
});
