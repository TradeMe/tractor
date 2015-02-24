module.exports = function () {
    var mockGetComponentFileNamesData = require('../mock_data/MockGetComponentFileNamesData.mock.json');
    var mockOpenComponentFileExampleComponent = require('../mock_data/MockOpenComponentFileExampleComponent.mock.json');
    this.Given(/^I have a saved component$/, function (done) {
        httpBackend.onLoad.when('GET', '/get-component-file-names').respond(mockGetComponentFileNamesData);
        httpBackend.onLoad.when('GET', '/open-component-file?name=ExampleComponent').respond(mockOpenComponentFileExampleComponent);
        done();
    });
};
