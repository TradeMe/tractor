/*{"name":"When I navigate to the Page Objects plugin","pageObjects":[{"name":"tractor"}],"mockRequests":[]}*/
module.exports = function () {
    var Tractor = require('../../src/tractor/client/tractor.po.js'), tractor = new Tractor();
    this.When(/^I navigate to the Page Objects plugin$/, function (done) {
        var tasks = tractor.goToPageObjects();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};