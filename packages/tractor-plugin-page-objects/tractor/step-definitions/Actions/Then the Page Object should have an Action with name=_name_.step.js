/*{"name":"Then the Page Object should have an Action with name=\"name\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Page Object should have an Action with name="([^"]*)"$/, function (name, done) {
        Promise.all([expect(tractorPageObjects.getActionName()).to.eventually.equal(name)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};