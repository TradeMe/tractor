/*{"name":"Then the Element selector has as error=\"error\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Element selector has as error="([^"]*)"$/, function (error, done) {
        Promise.all([expect(tractorPageObjects.getElementSelectorValidation()).to.eventually.equal(error)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};
