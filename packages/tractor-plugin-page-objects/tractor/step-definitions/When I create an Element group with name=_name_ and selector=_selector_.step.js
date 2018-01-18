/*{"name":"When I create an Element group with name=\"name\" and selector=\"selector\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I create an Element group with name="([^"]*)" and selector="([^"]*)"$/, function (name, selector, done) {
        var tasks = tractorPageObjects.createElementGroup(name, selector);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};