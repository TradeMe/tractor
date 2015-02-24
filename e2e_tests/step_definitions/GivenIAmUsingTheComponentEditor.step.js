module.exports = function () {
    var ControlPanel = require('../components/ControlPanel.component');
    var controlPanel = new ControlPanel();
    var mockGetComponentFileNamesData = require('../mock_data/MockGetComponentFileNamesData.mock.json');
    var mockOpenComponentFileExampleComponent = require('../mock_data/MockOpenComponentFileExampleComponent.mock.json');
    this.Given(/^I am using the Component Editor$/, function (done) {
        var tasks = browser.get('http://localhost:3000/index.dev.html').then(function () {
            return function () {
                httpBackend.when('GET', '/get-component-file-names').respond(mockGetComponentFileNamesData);
                httpBackend.when('GET', '/open-component-file?name=ExampleComponent').respond(mockOpenComponentFileExampleComponent);
                httpBackend.when('GET', /.*/).passThrough();
                httpBackend.when('POST', /.*/).passThrough();
                httpBackend.when('DELETE', /.*/).passThrough();
                httpBackend.when('PUT', /.*/).passThrough();
                httpBackend.when('HEAD', /.*/).passThrough();
                httpBackend.when('PATCH', /.*/).passThrough();
                return httpBackend.flush();
            }();
        }).then(function () {
            return controlPanel.goToComponentEditor();
        });
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};
