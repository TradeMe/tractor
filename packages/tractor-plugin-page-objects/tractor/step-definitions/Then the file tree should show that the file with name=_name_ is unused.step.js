/*{"name":"Then the file tree should show that the file with name=\"name\" is unused","pageObjects":[{"name":"tractor-file-tree"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorFileTree = require('../../src/tractor/client/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
    this.Then(/^the file tree should show that the file with name="([^"]*)" is unused$/, function (name, done) {
        Promise.all([expect(tractorFileTree.statusText(name)).to.eventually.contain('unused')]).spread(function () {
            done();
        }).catch(done.fail);
    });
};