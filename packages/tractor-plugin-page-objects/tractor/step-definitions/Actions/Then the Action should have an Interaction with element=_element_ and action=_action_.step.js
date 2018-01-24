/*{"name":"Then the Action should have an Interaction with element=\"element\" and action=\"action\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Action should have an Interaction with element="([^"]*)" and action="([^"]*)"$/, function (element, action, done) {
        Promise.all([
            expect(tractorPageObjects.getInteractionElement()).to.eventually.equal(element),
            expect(tractorPageObjects.getInteractionAction()).to.eventually.equal(action)
        ]).spread(function () {
            done();
        }).catch(done.fail);
    });
};