module.exports = function () {
    var ComponentFileTree = require('../components/ComponentFileTree.component');
    var componentFileTree = new ComponentFileTree();
    this.When(/^I open a component$/, function (done) {
        var tasks = componentFileTree.openExampleComponent();
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};
