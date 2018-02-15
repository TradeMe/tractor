/*{"name":"Then I cannot see the terminal","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.Then(/^I cannot see the terminal$/, function (done) {
        Promise.all([expect(controlPanel.getTerminalIsDisplayed()).to.eventually.equal(false)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};