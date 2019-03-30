/*{"name":"Mocha Spec file","tests":[{"name":"Create Mocha Spec file"},{"name":"Rename Mocha Spec file"},{"name":"Invalid name - required"}],"version":"0.1.0"}*/
describe('Mocha Spec file', function () {
    it('Create Mocha Spec file', function () {
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('../../../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
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
            return element.createAndSaveMochaSpec('Mocha spec');
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return expect(element.getFileName('Mocha spec')).to.eventually.equal('Mocha spec');
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.openFile('Mocha spec');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return expect(element.getName()).to.eventually.equal('Mocha spec');
        });
        return step;
    });
    it('Rename Mocha Spec file', function () {
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('../../../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
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
            return element.createAndSaveMochaSpec('Should be renamed');
        });
        step = step.then(function () {
            return browser.sleep(5000);
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.editFileName('Should be renamed', 'Changed');
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return expect(element.getFileName('Changed')).to.eventually.equal('Changed');
        });
        step = step.then(function () {
            return browser.sleep(5000);
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.openFile('Changed');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return expect(element.getName()).to.eventually.equal('Changed');
        });
        return step;
    });
    it('Invalid name - required', function () {
        var TractorMochaSpecs = require('./tractor-mocha-specs.po.js'), tractorMochaSpecs = new TractorMochaSpecs();
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
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
            return element.createAndSaveMochaSpec('');
        });
        step = step.then(function () {
            var element;
            element = tractorMochaSpecs;
            return expect(element.getNameValidation()).to.eventually.equal('Required');
        });
        return step;
    });
});
