/*{
    "name": "Given I have existing component data",
    "components": [],
    "mockData": [
        {
            "name": "Mock get component file structure"
        }
    ]
}*/
module.exports = function () {
    var mockGetComponentFileStructure = require('../../mock_data/Mock get component file structure.mock.json');
    this.Given(/^I have existing component data$/, function (done) {
        httpBackend.onLoad.when('GET', '/get-file-structure?directory=components&parse=true').respond(mockGetComponentFileStructure);
        done();
    });
};