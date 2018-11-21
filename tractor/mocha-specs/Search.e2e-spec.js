/*{"name":"Search","tests":[{"name":"search results"}],"version":"0.1.0"}*/
describe('Search', function () {
    it('search results', function () {
        var Tractor = require('../../packages/ui/src/app/tractor.po.js'), tractor = new Tractor();
        var File = require('../../packages/ui/src/app/file.po.js'), file = new File();
        var Search = require('../../packages/ui/src/app/features/Search/search.po.js'), search = new Search();
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
});