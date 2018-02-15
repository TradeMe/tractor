/*{"name":"When I close the terminal","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.When(/^I close the terminal$/, function (done) {
        var tasks = controlPanel.hideTerminal();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};