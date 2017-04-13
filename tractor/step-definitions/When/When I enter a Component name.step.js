/*{
    "name": "When I enter a Component name",
    "components": [
        {
            "name": "Component header"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentHeader = require('../../components/Component Editor/Component header.component.js'), componentHeader = new ComponentHeader();
    this.When(/^I enter a Component name$/, function (done) {
        var tasks = componentHeader.setName('Component');
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};