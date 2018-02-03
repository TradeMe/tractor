/*{"name":"Then the Page Object name has an error=\"message\"","pageObjects":[{"name":"tractor-page-objects"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorPageObjects = require('../../../src/tractor/client/tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
    this.Then(/^the Page Object name has an error="([^"]*)"$$/, function (error, done) {
        Promise.all([expect(tractorPageObjects.getNameValidation()).to.eventually.equal(error)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};
