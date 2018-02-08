/*{"name":"When I navigate to the Page Objects plugin","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.When(/^I navigate to the Page Objects plugin$/, function (done) {
        var tasks = controlPanel.openPlugin('Page Objects');
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
