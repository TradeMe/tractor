/*{"name":"Then run feature button is present","components":[{"name":"FeaturePage"}],"mockData":[]}*/
module.exports = function () {
    var FeaturePage = require('../components/FeaturePage.component.js'), featurePage = new FeaturePage();
    this.Then(/^run feature button is present$/, function (done) {
        Promise.all([expect(featurePage.runFeatureButtonIsPresent()).to.eventually.equal(true)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};