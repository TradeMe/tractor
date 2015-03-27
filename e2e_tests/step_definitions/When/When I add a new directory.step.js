/*{
    "name": "When I add a new directory",
    "components": [
        {
            "name": "Component File Tree"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileTree = require('../../components/Component Editor/Component File Tree.component.js'), componentFileTree = new ComponentFileTree();
    this.When(/^I add a new directory$/, function (done) {
        var tasks = componentFileTree.addDirectory();
        tasks.then(done);
    });
};