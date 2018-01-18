/*{"name":"Then the page object should have an Element group with name=\"name\" and selector=\"selector\" and type=\"type\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the page object should have an Element group with name="([^"]*)" and selector="([^"]*)" and type="([^"]*)"$/, function (name, selector, type, done) {
        Promise.all([
            expect(tractorPageObjects.getElementName()).to.eventually.equal(name),
            expect(tractorPageObjects.getElementSelector()).to.eventually.equal(selector),
            expect(tractorPageObjects.getElementIsMultiple()).to.eventually.equal(true),
            expect(tractorPageObjects.getElementType()).to.eventually.equal(type)
        ]).spread(function () {
            done();
        }).catch(done.fail);
    });
};