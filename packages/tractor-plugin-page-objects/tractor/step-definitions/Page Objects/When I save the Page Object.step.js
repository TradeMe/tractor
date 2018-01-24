/*{"name":"When I save the Page Object","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.When(/^I save the Page Object$/, function (done) {
        var tasks = tractorPageObjects.savePageObjectFile();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
