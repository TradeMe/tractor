/*{"name":"When I create an Element with name=\"name\" and selector=\"selector\""}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I create an Element with name="([^"]*)" and selector="([^"]*)"$/, function (name, selector, done) {
        var tasks = tractorPageObjects.createElement(name, selector);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
