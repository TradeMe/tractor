/*{"name":"When I create an Element with name=\"name\" and selector=\"selector\" and type=\"type\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I create an Element with name="([^"]*)" and selector="([^"]*)" and type="([^"]*)"$/, function (name, selector, type, done) {
        var tasks = tractorPageObjects.createTypedElement(name, selector, type);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};