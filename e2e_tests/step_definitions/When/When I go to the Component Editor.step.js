/*{
    "name": "When I go to the Component Editor",
    "components": [
        {
            "name": "Control Panel"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ControlPanel = require('../../components/Tractor/Control Panel.component.js'), controlPanel = new ControlPanel();
    this.When(/^I go to the Component Editor$/, function (done) {
        var tasks = controlPanel.goToComponentEditor();
        Promise.all(tasks).then(function () {
            done();
        });
    });
};