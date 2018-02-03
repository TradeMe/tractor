/*{"name":"Then the Interaction Argument with the name=\"name\" has as error=\"error\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Interaction Argument with the name="([^"]*)" has as error="([^"]*)"$/, function (name, error, done) {
        Promise.all([expect(tractorPageObjects.getInteractionArgumentValidation(name)).to.eventually.equal(error)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};