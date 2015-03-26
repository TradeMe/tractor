/*{
    "name": "Then I can see the name of the Component",
    "components": [
        {
            "name": "Component File Options"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileOptions = require('../../components/Component Editor/Component File Options.component.js'), componentFileOptions = new ComponentFileOptions();
    this.Then(/^I can see the name of the Component$/, function (done) {
        Promise.all([expect(componentFileOptions.getComponentName()).to.eventually.equal('Example Component')]).then(function () {
            done();
        });
    });
};