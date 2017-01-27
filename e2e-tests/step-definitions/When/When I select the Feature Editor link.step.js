/*{"name":"When I select the Feature Editor link","components":[{"name":"FeaturePage"}],"mockData":[]}*/
module.exports = function () {
    var FeaturePage = require('../../components/FeaturePage.component.js'), featurePage = new FeaturePage();
    this.When(/^I select the Feature Editor link$/, function (done) {
        var tasks = featurePage.selectFeaturePageLink();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};