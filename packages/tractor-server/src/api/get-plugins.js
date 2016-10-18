// Constants:
import tractorPluginLoader from 'tractor-plugin-loader';

export default { handler };

function handler (request, response) {
    let pluginDescriptions = tractorPluginLoader.getPluginDescriptions();
    response.send(pluginDescriptions);
}
