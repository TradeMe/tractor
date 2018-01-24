/*{"name":"Then the Page Object should have an Element group with name=\"name\" and selector=\"selector\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Page Object should have an Element group with name="([^"]*)" and selector="([^"]*)"$/, function (name, selector, done) {
        Promise.all([
            expect(tractorPageObjects.getElementName()).to.eventually.equal(name),
            expect(tractorPageObjects.getElementSelector()).to.eventually.equal(selector),
            expect(tractorPageObjects.getElementIsGroup()).to.eventually.equal(true)
        ]).spread(function () {
            done();
        }).catch(done.fail);
    });
};