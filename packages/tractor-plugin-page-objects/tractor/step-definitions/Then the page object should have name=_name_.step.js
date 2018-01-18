/*{"name":"Then the page object should have name=\"name\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the page object should have name="([^"]*)"$/, function (name, done) {
        Promise.all([expect(tractorPageObjects.getName()).to.eventually.equal(name)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};