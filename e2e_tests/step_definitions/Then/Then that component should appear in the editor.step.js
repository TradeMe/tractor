/*{
    "name": "Then that component should appear in the editor",
    "components": [
        {
            "name": "Component File Options"
        }
    ],
    "mockData": []
}*/
module.exports = function () {
    var ComponentFileOptions = require('../../components/Component Editor/Component File Options.component.js'), componentFileOptions = new ComponentFileOptions();
    this.Then(/^that component should appear in the editor$/, function (done) {
        Promise.all([expect(componentFileOptions.getComponentName()).to.eventually.equal('Example Component')]).then(function () {
            done();
        });
    });
};