export function getConfigHandler (config) {
    return function (request, response) {
        response.send(config);
    }
}
getConfigHandler['@Inject'] = ['config'];
