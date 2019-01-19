/*{"name":"Screen Size","tests":[{"name":"Resize based on tag #sm"},{"name":"Resize based on tag #md"},{"name":"Resize based on tag #lg"}],"version":"0.1.0"}*/
describe('Screen Size', function () {
    it('Resize based on tag #sm', function () {
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = screenSize;
            return expect(element.getWidth()).to.eventually.equal(576);
        });
        return step;
    });

    it('Resize based on tag #md', function () {
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = screenSize;
            return expect(element.getWidth()).to.eventually.equal(768);
        });
        return step;
    });

    it('Resize based on tag #lg', function () {
        var Tractor = require('../../../../../node_modules/@tractor/ui/dist/page-objects/tractor.po.js'), tractor = new Tractor();
        var step = Promise.resolve();
        step = step.then(function () {
            var element;
            element = tractor;
            return element.goHome();
        });
        step = step.then(function () {
            var element;
            element = screenSize;
            return expect(element.getWidth()).to.eventually.equal(1024);
        });
        return step;
    });
});
