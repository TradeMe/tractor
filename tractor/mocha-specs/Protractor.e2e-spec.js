/*{"name":"Protractor","tests":[{"name":"Run Protractor"}],"version":"0.1.0"}*/
describe('Protractor', function () {
    it('Run Protractor', function () {
        var Tractor = require('../../packages/ui/src/app/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../packages/ui/src/app/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.setTag('Tag');
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.selectEnvironment('http://localhost:4444');
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.runProtractor();
        });
        return step;
    });
});