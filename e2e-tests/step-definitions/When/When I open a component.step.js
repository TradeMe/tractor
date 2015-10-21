/*{
    "name": "When I open a Component",
    "components": [
        {
            "name": "Component file tree"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileTree = require('../../components/Component Editor/Component file tree.component.js'), componentFileTree = new ComponentFileTree();
    this.When(/^I open a Component$/, function (done) {
        var tasks = componentFileTree.openFirstComponent();
        Promise.resolve(tasks).then(done).catch(function () {
            browser.pause();
            done.fail();
        });
    });
};