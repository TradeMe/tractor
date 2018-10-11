/*{"name":"Page Object file","tests":[{"name":"Create Page Object file"},{"name":"Rename Page Object file","reason":"Test fails because of \"stale element\""},{"name":"Invalid name - required"},{"name":"Invalid name - valid identifier"}],"version":"0.1.0"}*/
describe('Page Object file', function () {
    it('Create Page Object file', function () {
        var TractorPageObjects = require('./tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
        var Tractor = require('../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Page Objects');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject('Page object');
        });
        step = step.then(function () {
            return browser.sleep(5000);
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return expect(element.getFileName('Page object')).to.eventually.equal('Page object');
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.openFile('Page object');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return expect(element.getName()).to.eventually.equal('Page object');
        });
        return step;
    });
    it.skip('Rename Page Object file', function () {
        var TractorPageObjects = require('./tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
        var Tractor = require('../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('../../../node_modules/@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Page Objects');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject('Should be renamed');
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
            return browser.sleep(6000);
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.openFile('Changed');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return expect(element.getName()).to.eventually.equal('Changed');
        });
        return step;
    });
    it('Invalid name - required', function () {
        var TractorPageObjects = require('./tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
        var Tractor = require('../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Page Objects');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject('');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return expect(element.getNameValidation()).to.eventually.equal('Required');
        });
        return step;
    });
    it('Invalid name - valid identifier', function () {
        var TractorPageObjects = require('./tractor-page-objects.po.js'), tractorPageObjects = new TractorPageObjects();
        var Tractor = require('../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('../../../node_modules/@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Page Objects');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject(1);
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return expect(element.getNameValidation()).to.eventually.equal('That is not a valid name');
        });
        return step;
    });
});