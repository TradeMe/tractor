/*{"name":"Terminal","tests":[{"name":"Show and hide terminal"}],"version":"1.4.0"}*/
describe('Terminal', function () {
    it('Show and hide terminal', function () {
        this.retries(3);
        var Tractor = require('../../src/app/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.showTerminal();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return expect(element.getTerminalIsDisplayed()).to.eventually.equal(true);
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.hideTerminal();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return expect(element.getTerminalIsDisplayed()).to.eventually.equal(false);
        });
        return step;
    });
});