/*{"name":"Then plugins have been loaded","pageObjects":[{"name":"control-panel"}],"mockRequests":[]}*/
module.exports = function () {
    var ControlPanel = require('../../packages/tractor-ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
    this.Then(/^plugins have been loaded$/, function (done) {
        Promise.all([expect(controlPanel.pluginIsLoaded('Features')).to.eventually.equal(true)]).spread(function () {
            done();
        }).catch(done.fail);
    });
};
