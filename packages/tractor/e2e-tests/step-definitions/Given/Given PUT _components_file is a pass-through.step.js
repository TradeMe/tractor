/*{
    "name": "Given PUT /components/file is a pass-through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^PUT \/components\/file is a pass\-through$/, function (done) {
        httpBackend.whenPUT(/\/components\/file/).passThrough();
        done();
    });
};