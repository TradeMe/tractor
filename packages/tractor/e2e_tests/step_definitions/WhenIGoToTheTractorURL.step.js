module.exports = function () {
    var Tractor = require('../components/Tractor.component');
    var tractor = new Tractor();
    this.When(/^I go to the tractor URL$/, function (done) {
        var tasks = tractor.get();
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};