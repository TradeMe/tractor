/*{
    "name": "Then I can see tractor running",
    "components": [
        {
            "name": "Tractor"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var Tractor = require('../../components/Tractor/Tractor.component.js'), tractor = new Tractor();
    this.Then(/^I can see tractor running$/, function (done) {
        Promise.all([expect(tractor.getTitle()).to.eventually.equal('tractor')]).then(function () {
            done();
        });
    });
};