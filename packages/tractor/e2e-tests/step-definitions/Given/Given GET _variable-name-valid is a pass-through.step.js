/*{
    "name": "Given GET /variable-name-valid is a pass-through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^GET \/variable\-name\-valid is a pass\-through$/, function (done) {
        httpBackend.whenGET(/\/variable-name-valid\?.*/).passThrough();
        done();
    });
};