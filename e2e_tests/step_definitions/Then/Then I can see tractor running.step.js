module.exports = function () {
    var Tractor = require('../components/Tractor.component');
    var tractor = new Tractor();
    this.Then(/^I can see tractor running$/, function (done) {
        Promise.all([expect(tractor.getTitle()).to.eventually.equal('tractor')]).then(function () {
            done();
        });
    });
};
