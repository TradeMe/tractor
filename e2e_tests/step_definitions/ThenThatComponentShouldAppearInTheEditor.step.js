module.exports = function () {
    var ComponentFileOptions = require('../components/ComponentFileOptions.component');
    var componentFileOptions = new ComponentFileOptions();
    this.Then(/^that component should appear in the editor$/, function (done) {
        Promise.all([expect(componentFileOptions.getComponentName()).to.eventually.equal('ExampleComponent')]).then(function () {
            done();
        });
    });
};