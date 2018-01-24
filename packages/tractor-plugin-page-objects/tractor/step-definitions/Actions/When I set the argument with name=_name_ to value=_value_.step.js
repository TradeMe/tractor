/*{"name":"When I set the argument with name=\"name\" to value=\"value\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I set the argument with name="([^"]*)" to value="([^"]*)"$/, function (name, value, done) {
        var tasks = tractorPageObjects.addActionArgument(name, value);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};