/*{"name":"When I rename the Page Object with name=\"name\" to newName=\"newName\"","pageObjects":[{"name":"tractor-file-tree"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorFileTree = require('../../src/tractor/client/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
    this.When(/^I rename the Page Object with name="([^"]*)" to newName="([^"]*)"$/, function (name, newName, done) {
        var tasks = tractorFileTree.editName(name, newName);
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};
