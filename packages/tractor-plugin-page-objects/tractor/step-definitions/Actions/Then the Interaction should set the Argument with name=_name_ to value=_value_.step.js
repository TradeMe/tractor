/*{"name":"Then the Interaction should set the Argument with name=\"name\" to value=\"value\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Interaction should set the Argument with name="([^"]*)" to value="([^"]*)"$/, function (name, value, done) {
        Promise.all([expect(tractorPageObjects.getInteractionArgumentValue(name)).to.eventually.equal(value)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};