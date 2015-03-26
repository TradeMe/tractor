/*{
    "name": "When I go to the Component Editor",
    "components": [
        {
            "name": "Control Panel"
        },
        {
            "name": "Tractor"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ControlPanel = require('../../components/Tractor/Control Panel.component.js'), controlPanel = new ControlPanel();
    var Tractor = require('../../components/Tractor/Tractor.component.js'), tractor = new Tractor();
    this.When(/^I go to the Component Editor$/, function (done) {
        var tasks = tractor.get().then(function () {
            return controlPanel.goToComponentEditor();
        });
        tasks.then(done);
    });
};