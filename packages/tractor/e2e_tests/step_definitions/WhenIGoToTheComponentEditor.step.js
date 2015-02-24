module.exports = function () {
    var Tractor = require('../components/Tractor.component');
    var tractor = new Tractor();
    var ControlPanel = require('../components/ControlPanel.component');
    var controlPanel = new ControlPanel();
    this.When(/^I go to the Component Editor$/, function (done) {
        var tasks = tractor.get().then(function () {
            return controlPanel.goToComponentEditor();
        });
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};