/*{
    "name": "Given that add-directory is a pass through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^that add\-directory is a pass through$/, function (done) {
        httpBackend.when('POST', '/add-directory').passThrough();
        done();
    });
};