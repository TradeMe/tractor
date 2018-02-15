/*{"name":"When I create and save Mock Data with name=\"name\"","pageObjects":[{"name":"tractor-mock-requests"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorMockRequests = require('../../../src/tractor/client/tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
    this.When(/^I create and save new Mock Data with name="([^"]*)"$/, function (name, done) {
        var tasks = tractorMockRequests.createAndSaveMockDataFile(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
