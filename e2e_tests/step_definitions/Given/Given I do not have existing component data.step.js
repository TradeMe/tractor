/*{
    "name": "Given I do not have existing component data",
    "components": [],
    "mockData": [
        {
            "name": "Mock get file structure (empty)"
        }
    ]
}*/
module.exports = function () {
    var mockGetFileStructureEmpty = require('../../mock_data/Mock get file structure (empty).mock.json');
    this.Given(/^I do not have existing component data$/, function (done) {
        httpBackend.whenGET('/get-file-structure').respond(mockGetFileStructureEmpty);
        done();
    });
};
