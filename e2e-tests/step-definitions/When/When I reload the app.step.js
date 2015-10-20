/*{
    "name": "When I reload the app",
    "components": [
        {
            "name": "Tractor"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var Tractor = require('../../components/Tractor.component.js'), tractor = new Tractor();
    this.When(/^I reload the app$/, function (done) {
        var tasks = tractor.refresh();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};