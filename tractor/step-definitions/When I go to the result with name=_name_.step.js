/*{"name":"When I go to the result with name=\"name\"","pageObjects":[{"name":"search"}],"mockRequests":[]}*/
module.exports = function () {
    var Search = require('../../packages/tractor-ui/src/app/features/Search/search.po.js'), search = new Search();
    this.When(/^I go to the result with name="([^"]*)"$/, function (name, done) {
        var tasks = search.goToResult(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};