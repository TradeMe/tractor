export function getPluginsHandler (plugins) {
    return function (request, response) {
        let pluginDescriptions = plugins.map(plugin => plugin.description);
        response.send(pluginDescriptions);
    };
}
getPluginsHandler['@Inject'] = ['plugins'];
