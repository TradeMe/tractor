/*{"name":"When I run protractor with tag=\"tag\" and environment=\"environment\"","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.When(/^I run protractor with tag="([^"]*)" and environment="([^"]*)"$/, function (tag, environment, done) {
        var tasks = controlPanel.selectTag(tag).then(function () {
            return controlPanel.selectEnvironment(environment);
        }).then(function () {
            return controlPanel.runProtractor();
        });
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
