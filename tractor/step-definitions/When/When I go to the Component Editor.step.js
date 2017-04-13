/*{"name":"When I go to the Component Editor","components":[{"name":"Control Panel"}],"mockData":[]}*/
module.exports = function () {
    var ControlPanel = require('../../components/Control Panel.component.js'), controlPanel = new ControlPanel();
    this.When(/^I go to the Component Editor$/, function (done) {
        var tasks = controlPanel.goToComponents();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};