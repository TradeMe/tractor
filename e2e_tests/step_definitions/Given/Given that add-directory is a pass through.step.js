/*{
    "name": "Given that add-directory is a pass through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^that add\-directory is a pass through$/, function (done) {
        httpBackend.whenPOST('/add-directory').passThrough();
        done();
    });
};
