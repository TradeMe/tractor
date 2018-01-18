/*{"name":"Then the file tree should have a file with name=\"name\"","pageObjects":[{"name":"tractor-file-tree"}],"mockRequests":[]}*/
module.exports = function () {
    var TractorFileTree = require('../../src/tractor/client/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
    this.Then(/^the file tree should have a file with name="([^"]*)"$/, function (name, done) {
        Promise.all([expect(tractorFileTree.getName(name)).to.eventually.equal(name)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};
