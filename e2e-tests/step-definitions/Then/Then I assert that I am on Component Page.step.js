/*{"name":"Then I assert that I am on Component Page","components":[{"name":"ComponentPage"}],"mockData":[]}*/
module.exports = function () {
    var ComponentPage = require('../../components/ComponentPage.component.js'), componentPage = new ComponentPage();
    this.Then(/^I assert that I am on Component Page$/, function (done) {
        Promise.all([expect(componentPage.getName()).to.eventually.equal('Components files:')]).spread(function () {
            done();
        }).catch(done.fail);
    });
};