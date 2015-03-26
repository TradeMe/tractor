/*{
    "name": "When I open a component",
    "components": [
        {
            "name": "Component File Tree"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileTree = require('../../components/Component Editor/Component File Tree.component.js'), componentFileTree = new ComponentFileTree();
    this.When(/^I open a component$/, function (done) {
        var tasks = componentFileTree.openExampleComponent();
        Promise.all(tasks).then(function () {
            done();
        });
    });
};