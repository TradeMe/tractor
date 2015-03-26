/*{
    "name": "When I set the name of a Component",
    "components": [
        {
            "name": "Component File Options"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileOptions = require('../../components/Component Editor/Component File Options.component.js'), componentFileOptions = new ComponentFileOptions();
    this.When(/^I set the name of a Component$/, function (done) {
        var tasks = componentFileOptions.setComponentName('Example Component');
        Promise.all(tasks).then(function () {
            done();
        });
    });
};