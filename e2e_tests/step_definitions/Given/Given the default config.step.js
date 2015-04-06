/*{
    "name": "Given the default config",
    "components": [],
    "mockData": [
        {
            "name": "Mock default config"
        }
    ]
}*/
module.exports = function () {
    var mockDefaultConfig = require('../../mock_data/Mock default config.mock.json');
    this.Given(/^the default config$/, function (done) {
        httpBackend.whenGET('/config').respond(mockDefaultConfig);
        done();
    });
};
