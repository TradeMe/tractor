/*{
    "name": "Given I do not have existing component data",
    "components": [],
    "mockData": [
        {
            "name": "Mock get component file structure (empty)"
        }
    ]
}*/
module.exports = function () {
    var mockGetComponentFileStructureEmpty = require('../../mock_data/Mock get component file structure (empty).mock.json');
    this.Given(/^I do not have existing component data$/, function (done) {
        httpBackend.whenGET('/get-file-structure').respond(mockGetComponentFileStructureEmpty);
        done();
    });
};
