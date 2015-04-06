/*{
    "name": "Given I have existing component data",
    "components": [],
    "mockData": [
        {
            "name": "Mock get file structure with component"
        }
    ]
}*/
module.exports = function () {
    var mockGetFileStructureWithComponent = require('../../mock_data/Mock get file structure with component.mock.json');
    this.Given(/^I have existing component data$/, function (done) {
        httpBackend.whenGET('/get-file-structure').respond(mockGetFileStructureWithComponent);
        done();
    });
};
