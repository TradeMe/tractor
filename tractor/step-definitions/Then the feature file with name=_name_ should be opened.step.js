/*{"name":"Then the feature file with name=\"name\" should be opened","pageObjects":[{"name":"file"}],"mockRequests":[]}*/
module.exports = function () {
    var File = require('../../packages/tractor-ui/src/app/file.po.js'), file = new File();
    this.Then(/^the feature file with name="([^"]*)" should be opened$/, function (name, done) {
        Promise.all([expect(file.getName()).to.eventually.equal(name)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};