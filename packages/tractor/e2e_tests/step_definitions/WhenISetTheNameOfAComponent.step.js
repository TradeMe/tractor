module.exports = function () {
    var ComponentFileOptions = require('../components/ComponentFileOptions.component');
    var componentFileOptions = new ComponentFileOptions();
    this.When(/^I set the name of a Component$/, function (done) {
        var tasks = componentFileOptions.setComponentName('Example Component');
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};