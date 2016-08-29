/*{"name":"Given GET /config is a pass-through","components":[],"mockData":[]}*/
module.exports = function () {
    this.Given(/^GET \/config is a pass\-through$/, function (done) {
        httpBackend.whenGET(/\/config/).passThrough();
        done();
    });
};