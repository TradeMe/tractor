/*{"name":"Screen Size","tests":[{"name":"Resize based on tag #sm","reason":"Min possible screen size differs between browsers and platforms"},{"name":"Resize based on tag #md"},{"name":"Resize based on tag #lg"},{"name":"Maximize based on tag #xl"},{"name":"Resize without a tag to the default"}],"version":"0.1.0"}*/
describe('Screen Size', function () {
    this.retries(3);
    it.skip('Resize based on tag #sm', function () {
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
            return expect(element.getWidth()).to.eventually.equal(400);
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
    
    it('Maximize based on tag #xl', function () {
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
            return element.getScreenWidth();
        });
        step = step.then(function (screenWidth) {
            var element;
            element = screenSize;
            return expect(element.getWidth()).to.eventually.equal(screenWidth);
        });
        step = step.then(function () {
            var element;
            element = screenSize;
            return element.getScreenHeight();
        });
        step = step.then(function (screenHeight) {
            var element;
            element = screenSize;
            return expect(element.getHeight()).to.eventually.equal(screenHeight);
        });
        return step;
    });

    it('Resize without a tag to the default', function () {
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
