/*{
    "name": "When I go to the Component Editor",
    "components": [
        {
            "name": "Tractor"
        },
        {
            "name": "Control Panel"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var Tractor = require('../../components/Tractor.component.js'), tractor = new Tractor();
    var ControlPanel = require('../../components/Control Panel.component.js'), controlPanel = new ControlPanel();
    this.When(/^I go to the Component Editor$/, function (done) {
        var tasks = tractor.get().then(function () {
            return controlPanel.goToComponents();
        });
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};