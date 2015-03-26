/*{
    "name": "When I go to the tractor URL",
    "components": [
        {
            "name": "Tractor"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var Tractor = require('../../components/Tractor/Tractor.component.js'), tractor = new Tractor();
    this.When(/^I go to the tractor URL$/, function (done) {
        var tasks = tractor.get();
        Promise.all(tasks).then(function () {
            done();
        });
    });
};