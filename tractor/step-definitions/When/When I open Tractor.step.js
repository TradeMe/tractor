/*{"name":"When I open Tractor","components":[{"name":"Tractor"}],"mockData":[]}*/
module.exports = function () {
    var Tractor = require('../../components/Tractor.component.js'), tractor = new Tractor();
    this.When(/^I open Tractor$/, function (done) {
        var tasks = tractor.get();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};