/*{"name":"Then the page object should have an Element with name=\"name\" and selector=\"selector\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the page object should have an Element with name="([^"]*)" and selector="([^"]*)"$/, function (name, selector, done) {
        Promise.all([
            expect(tractorPageObjects.getElementName()).to.eventually.equal(name),
            expect(tractorPageObjects.getElementSelector()).to.eventually.equal(selector)
        ]).spread(function () {
            done();
        }).catch(done.fail);
    });
};