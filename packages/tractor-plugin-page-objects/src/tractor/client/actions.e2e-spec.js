/*{"name":"Actions","tests":[{"name":"add Action"},{"name":"add Action on element"},{"name":"Invalid name - required"},{"name":"Invalid name - valid identifier"},{"name":"Invalid name - unique"},{"name":"Invalid Parameter name - required"},{"name":"Invalid Parameter name - valid identifier"},{"name":"Invalid Parameter name - unique"},{"name":"Invalid Interaction Argument - required"}],"version":"0.1.0"}*/
describe('Actions', function () {
    it('add Action', function () {
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
            return element.createAndSavePageObject('With action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return element.addArgument('destination', '/');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return expect(element.getName()).to.eventually.equal('action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return expect(element.getElement()).to.eventually.equal('Browser');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return expect(element.getAction()).to.eventually.equal('get');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            element = element.arguments('destination');
            return expect(element.getValue()).to.eventually.equal('/');
        });
        return step;
    });
    it('add Action on element', function () {
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
            return element.createAndSavePageObject('With action on element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addElement('element', 'selector');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('action with parameters');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addParameter('parameter');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return element.selectElement('element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return element.selectAction('send keys');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addArgument('keys', 'parameter');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return expect(element.getName()).to.eventually.equal('action with parameters');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return expect(element.getElement()).to.eventually.equal('element');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return expect(element.getAction()).to.eventually.equal('send keys');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            element = element.arguments('keys');
            return expect(element.getValue()).to.eventually.equal('parameter');
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
            return element.createAndSavePageObject('Action required name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
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
            return element.createAndSavePageObject('Action valid identifier name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction(1);
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
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
            return element.createAndSavePageObject('Action unique name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return expect(element.getNameValidation()).to.eventually.equal('There is something else with the same name');
        });
        return step;
    });
    it('Invalid Parameter name - required', function () {
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
            return element.createAndSavePageObject('Parameter required name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addParameter('');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.parameters('last');
            return expect(element.getNameValidation()).to.eventually.equal('Required');
        });
        return step;
    });
    it('Invalid Parameter name - valid identifier', function () {
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
            return element.createAndSavePageObject('Parameter valid identifier name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addParameter(1);
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.parameters('last');
            return expect(element.getNameValidation()).to.eventually.equal('That is not a valid name');
        });
        return step;
    });
    it('Invalid Parameter name - unique', function () {
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
            return element.createAndSavePageObject('Parameter unique name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addParameter('Parameter');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            return element.addParameter('Parameter');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.parameters('last');
            return expect(element.getNameValidation()).to.eventually.equal('There is something else with the same name');
        });
        return step;
    });
    it('Invalid Interaction Argument - required', function () {
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
            return element.createAndSavePageObject('Interaction Argument required name');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.addAction('Action');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            return element.addArgument('destination', '');
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            return element.savePageObjectFile();
        });
        step = step.then(function () {
            var element;
            element = tractorPageObjects;
            element = element.actions('last');
            element = element.interactions('last');
            element = element.arguments('destination');
            return expect(element.getValidation()).to.eventually.equal('Required');
        });
        return step;
    });
});