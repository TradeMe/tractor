/*{"name":"When I open the Page Object with name=\"name\"","pageObjects":[{"name":"tractor-file-tree"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorFileTree = require('../../src/tractor/client/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
    this.When(/^I open the Page Object with name="([^"]*)"$/, function (name, done) {
        var tasks = tractorFileTree.openFile(name);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};