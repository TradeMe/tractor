/*{"name":"When I open the Page Object with name=\"name\"","pageObjects":[{"name":"tractor-file-tree"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorFileTree = require('../../../node_modules/tractor-client/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
    this.When(/^I open the Page Object with name="([^"]*)"$/, function (name, done) {
        var tasks = tractorFileTree.openFile(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
