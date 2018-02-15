/*{"name":"Then the Mock Data should have name=\"name\"","pageObjects":[{"name":"tractor-mock-requests"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorMockRequests = require('../../../src/tractor/client/tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
    this.Then(/^the Mock Data should have name="([^"]*)"$/, function (name, done) {
        Promise.all([expect(tractorMockRequests.getName()).to.eventually.equal(name)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};