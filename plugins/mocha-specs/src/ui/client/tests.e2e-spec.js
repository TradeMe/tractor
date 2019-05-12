/*{"name":"Tests","tests":[{"name":"Create test"},{"name":"Create test with \"only\""},{"name":"Create test with \"skip\""}],"version":"1.4.0"}*/
describe('Tests', function () {
    it('Create test', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mocha Specs');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.createAndSaveMochaSpec('test');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.addTest('test');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.saveMochaSpec();
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getName()).to.eventually.equal('test');
        });
        return step;
    });
    it('Create test with "only"', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mocha Specs');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.createAndSaveMochaSpec('test with only');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.addTest('test with only');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return element.toggleOnly();
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.saveMochaSpec();
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getOnly()).to.eventually.equal(true);
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getName()).to.eventually.equal('test with only');
        });
        return step;
    });
    it('Create test with "skip"', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mocha Specs');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.createAndSaveMochaSpec('test with skip');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.addTest('test with skip');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return element.toggleSkip();
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return element.setSkipReason('skip this test');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return element.saveMochaSpec();
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getSkip()).to.eventually.equal(true);
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getName()).to.eventually.equal('test with skip');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            element = element.tests('last');
            return expect(element.getSkipReason()).to.eventually.equal('skip this test');
        });
        return step;
    });
});