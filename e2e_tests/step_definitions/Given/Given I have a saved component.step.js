/*{
    "name": "Given I have a saved component",
    "components": [],
    "mockData": [
        {
            "name": "Mock Get Component File Names Data"
        },
        {
            "name": "Mock Open Component File Example Component"
        }
    ]
}*/
module.exports = function () {
    var mockGetComponentFileNamesData = require('../../../mock_data/Mock Get Component File Names Data.mock.json');
    var mockOpenComponentFileExampleComponent = require('../../../mock_data/Mock Open Component File Example Component.mock.json');
    this.Given(/^I have a saved component$/, function (done) {
        httpBackend.onLoad.when('GET', 'hello').respond(mockGetComponentFileNamesData);
        httpBackend.onLoad.when('GET', 'hello').respond(mockOpenComponentFileExampleComponent);
        done();
    });
};