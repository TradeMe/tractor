/*{
    "name": "Given GET /file-structure is a pass-through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^GET \/file\-structure is a pass\-through$/, function (done) {
        httpBackend.whenGET(/\/file-structure/).passThrough();
        done();
    });
};