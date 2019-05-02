/*{"name":"Mock Requests file","tests":[{"name":"Create Mock Request file"},{"name":"Rename Mock Request file"},{"name":"Invalid name - required"}],"version":"1.4.0"}*/
describe('Mock Requests file', function () {
    it('Create Mock Request file', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
        var TractorMockRequests = require('./tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mock Requests');
        });
        step = step.then(function () {
            var element;
            element = tractorMockRequests;
            return element.createAndSaveMockDataFile('Mock');
        });
        step = step.then(function () {
            return browser.sleep(5000);
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return expect(element.getFileName('Mock')).to.eventually.equal('Mock');
        });
        step = step.then(function () {
            var element;
            element = tractorFileTree;
            return element.openFile('Mock');
        });
        step = step.then(function () {
            var element;
            element = tractorMockRequests;
            return expect(element.getName()).to.eventually.equal('Mock');
        });
        return step;
    });
    it('Rename Mock Request file', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorFileTree = require('@tractor/ui/dist/page-objects/Core/Components/FileTree/tractor-file-tree.po.js'), tractorFileTree = new TractorFileTree();
        var TractorMockRequests = require('./tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mock Requests');
        });
        step = step.then(function () {
            var element;
            element = tractorMockRequests;
            return element.createAndSaveMockDataFile('Should be renamed');
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
            element = tractorMockRequests;
            return expect(element.getName()).to.eventually.equal('Changed');
        });
        return step;
    });
    it('Invalid name - required', function () {
        var Tractor = require('@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var ControlPanel = require('@tractor/ui/dist/page-objects/features/ControlPanel/control-panel.po.js'), controlPanel = new ControlPanel();
        var TractorMockRequests = require('./tractor-mock-requests.po.js'), tractorMockRequests = new TractorMockRequests();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = controlPanel;
            return element.openPlugin('Mock Requests');
        });
        step = step.then(function () {
            var element;
            element = tractorMockRequests;
            return element.createAndSaveMockDataFile('');
        });
        step = step.then(function () {
            var element;
            element = tractorMockRequests;
            return expect(element.getNameValidation()).to.eventually.equal('Required');
        });
        return step;
    });
});