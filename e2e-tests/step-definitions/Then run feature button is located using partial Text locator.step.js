/*{"name":"Then run feature button is located using partial Text locator","components":[{"name":"FeaturePage"}],"mockData":[]}*/
module.exports = function () {
    var FeaturePage = require('../components/FeaturePage.component.js'), featurePage = new FeaturePage();
    this.Then(/^run feature button is located using partial Text locator$/, function (done) {
        Promise.all([expect(featurePage.runFeatureButtonByPartialTextIsPresent()).to.eventually.equal(true)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};