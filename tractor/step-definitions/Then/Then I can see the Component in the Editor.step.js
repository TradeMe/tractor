/*{
    "name": "Then I can see the Component in the Editor",
    "components": [
        {
            "name": "Component header"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentHeader = require('../../components/Component Editor/Component header.component.js'), componentHeader = new ComponentHeader();
    this.Then(/^I can see the Component in the Editor$/, function (done) {
        Promise.all([expect(componentHeader.getName()).to.eventually.equal('Component')]).spread(function () {
            done();
        }).catch(done.fail);
    });
};
