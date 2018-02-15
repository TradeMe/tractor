/*{"name":"Then the Mock Data name has an error=\"error\"","pageObjects":[{"name":"tractor-mock-requests"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorMockRequests = require('../../../src/tractor/client/tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
    this.Then(/^the Mock Data name has an error="([^"]*)"$/, function (error, done) {
        Promise.all([expect(tractorMockRequests.getValidation()).to.eventually.equal(error)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};