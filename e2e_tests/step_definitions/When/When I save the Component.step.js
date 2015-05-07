/*{
    "name": "When I save the Component",
    "components": [
        {
            "name": "Component header"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentHeader = require('../../components/Component Editor/Component header.component.js'), componentHeader = new ComponentHeader();
    this.When(/^I save the Component$/, function (done) {
        var tasks = componentHeader.save();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};