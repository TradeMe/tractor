/*{"name":"When I select a feature from file tree","components":[{"name":"FeaturePage"}],"mockData":[]}*/
module.exports = function () {
    var FeaturePage = require('../../components/FeaturePage.component.js'), featurePage = new FeaturePage();
    this.When(/^I select a feature from file tree$/, function (done) {
        var tasks = featurePage.selectFeatureFromFeatureTree();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};