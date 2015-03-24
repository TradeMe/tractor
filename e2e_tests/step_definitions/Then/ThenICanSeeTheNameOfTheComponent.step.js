module.exports = function () {
    var ComponentFileOptions = require('../components/ComponentFileOptions.component');
    var componentFileOptions = new ComponentFileOptions();
    this.Then(/^I can see the name of the Component$/, function (done) {
        Promise.all([expect(componentFileOptions.getComponentName()).to.eventually.equal('ExampleComponent')]).then(function () {
            done();
        });
    });
};