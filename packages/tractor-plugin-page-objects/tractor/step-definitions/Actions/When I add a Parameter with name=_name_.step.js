/*{"name":"When I add a Parameter with name=\"name\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I add a Parameter with name="([^"]*)"$/, function (name, done) {
        var tasks = tractorPageObjects.addActionParameter(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};