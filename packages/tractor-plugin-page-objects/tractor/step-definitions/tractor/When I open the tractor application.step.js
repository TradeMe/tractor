/*{"name":"When I open the tractor application","pageObjects":[{"name":"tractor"}],"mockRequests":[]}*/
module.exports = function () {
    var Tractor = require('../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
    this.When(/^I open the tractor application$/, function (done) {
        var tasks = tractor.goHome();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
