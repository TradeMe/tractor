/*{
    "name": "Then I can see that the Component was saved",
    "components": [
        {
            "name": "Component file tree"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileTree = require('../../components/Component Editor/Component file tree.component.js'), componentFileTree = new ComponentFileTree();
    this.Then(/^I can see that the Component was saved$/, function (done) {
        Promise.all([expect(componentFileTree.getFirstComponentName()).to.eventually.equal('Component')]).spread(function () {
            done();
        }).catch(done.fail);
    });
};