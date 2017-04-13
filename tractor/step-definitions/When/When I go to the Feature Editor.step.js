/*{"name":"When I go to the Feature Editor","components":[{"name":"Control Panel"}],"mockData":[]}*/
module.exports = function () {
    var ControlPanel = require('../../components/Control Panel.component.js'), controlPanel = new ControlPanel();
    this.When(/^I go to the Feature Editor$/, function (done) {
        var tasks = controlPanel.goToFeatures();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};