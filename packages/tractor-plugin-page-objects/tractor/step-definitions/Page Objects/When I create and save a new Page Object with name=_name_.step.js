/*{"name":"When I create and save a new Page Object with name=\"name\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I create and save a new Page Object with name="([^"]*)"$/, function (name, done) {
        var tasks = tractorPageObjects.createAndSavePageObject(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};