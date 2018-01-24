/*{"name":"When I add an Element with name=\"name\" and selector=\"selector\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I add an Element with name="([^"]*)" and selector="([^"]*)"$/, function (name, selector, done) {
        var tasks = tractorPageObjects.addElement(name, selector);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};