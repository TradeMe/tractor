/*{"name":"When I search for searchString=\"search\"","pageObjects":[{"name":"search"},{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var Search = require('../../packages/tractor-ui/src/app/features/Search/search.po.js'), search = new Search();
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.When(/^I search for searchString="([^"]*)"$/, function (searchString, done) {
        var tasks = controlPanel.showSearch().then(function () {
            return search.search(searchString);
        });
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};