/*{
    "name": "Then I see a new directory",
    "components": [
        {
            "name": "Component File Tree"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileTree = require('../../components/Component Editor/Component File Tree.component.js'), componentFileTree = new ComponentFileTree();
    this.Then(/^I see a new directory$/, function (done) {
        Promise.all([expect(componentFileTree.getNameOfFirstDirectoryInRoot()).to.eventually.equal('New Directory')]).then(done);
    });
};