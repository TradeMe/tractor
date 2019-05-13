/*{"name":"Search","tests":[{"name":"search results"},{"name":"search keyboard shortcut"}],"version":"1.4.0"}*/
describe('Search', function () {
    it('search results', function () {
        var Tractor = require('../../src/app/tractor.po.js'), tractor = new Tractor();
        var File = require('../../src/app/file.po.js'), file = new File();
        var Search = require('../../src/app/features/Search/search.po.js'), search = new Search();
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
            return element.showSearch();
        });
        step = step.then(function () {
            var element;
            element = search;
            return element.search('sea');
        });
        step = step.then(function () {
            var element;
            element = search;
            return element.goToResult('Search.e2e-spec.js');
        });
        step = step.then(function () {
            var element;
            element = file;
            return expect(element.getName()).to.eventually.equal('Search');
        });
        return step;
    });
    it('search keyboard shortcut', function () {
        var Tractor = require('../../src/app/tractor.po.js'), tractor = new Tractor();
        var Search = require('../../src/app/features/Search/search.po.js'), search = new Search();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            return browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.CONTROL, 'f')).perform();
        });
        step = step.then(function () {
            var element;
            element = search;
            return expect(element.isPresent()).to.eventually.equal(true);
        });
        step = step.then(function () {
            return browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        });
        step = step.then(function () {
            var element;
            element = search;
            return expect(element.isPresent()).to.eventually.equal(false);
        });
        return step;
    });
});
