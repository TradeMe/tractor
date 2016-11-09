/*{"name":"When I select the Component Editor using linkText","components":[{"name":"ComponentPage"}],"mockData":[]}*/
module.exports = function () {
    var ComponentPage = require('../../components/ComponentPage.component.js'), componentPage = new ComponentPage();
    this.When(/^I select the Component Editor using linkText$/, function (done) {
        var tasks = componentPage.clickComponentsPageLink();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};