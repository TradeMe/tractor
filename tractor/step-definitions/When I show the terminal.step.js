/*{"name":"When I show the terminal","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.When(/^I show the terminal$/, function (done) {
        var tasks = controlPanel.showTerminal();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};