/*{"name":"Elements","tests":[{"name":"add Element"},{"name":"add Element group"},{"name":"add typed Element"},{"name":"add typed Element group"},{"name":"Invalid name - required"},{"name":"Invalid name - valid identifier"},{"name":"Invalid name - unique"},{"name":"Invalid selector - required"}],"version":"0.1.0"}*/
describe('Elements', function () {
    it('add Element', function () {
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
            return element.createAndSavePageObject('With element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('element', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getName()).to.eventually.equal('element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getSelector()).to.eventually.equal('selector');
        });
        return step;
    });
    it('add Element group', function () {
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
            return element.createAndSavePageObject('With element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('element group', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return element.toggleGroup();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getName()).to.eventually.equal('element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getSelector()).to.eventually.equal('selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getGroup()).to.eventually.equal(true);
        });
        return step;
    });
    it('add typed Element', function () {
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
            return element.createAndSavePageObject('Type for element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject('With typed element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('typed element', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return element.addType('Type for element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getName()).to.eventually.equal('typed element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getSelector()).to.eventually.equal('selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getType()).to.eventually.equal('Type for element');
        });
        return step;
    });
    it('add typed Element group', function () {
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
            return element.createAndSavePageObject('Type for element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.createAndSavePageObject('With typed element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('typed element group', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return element.toggleGroup();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return element.addType('Type for element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getName()).to.eventually.equal('typed element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getSelector()).to.eventually.equal('selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getType()).to.eventually.equal('Type for element group');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getGroup()).to.eventually.equal(true);
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
            return element.createAndSavePageObject('Element required name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('', '');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
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
            return element.createAndSavePageObject('Element valid identifier name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement(1, 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getNameValidation()).to.eventually.equal('That is not a valid name');
        });
        return step;
    });
    it('Invalid name - unique', function () {
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
            return element.createAndSavePageObject('Element unique name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('Element', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('Element', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getNameValidation()).to.eventually.equal('There is something else with the same name');
        });
        return step;
    });
    it('Invalid selector - required', function () {
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
            return element.createAndSavePageObject('Element required selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('', '');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.elements('last');
            return expect(element.getSelectorValidation()).to.eventually.equal('Required');
        });
        return step;
    });
});
