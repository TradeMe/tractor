/*{"name":"Given GET /file?path is a pass-through","components":[],"mockData":[]}*/
module.exports = function () {
    this.Given(/^GET \/file\?path is a pass\-through$/, function (done) {
        httpBackend.whenGET(/.*\/file\?path=*/).passThrough();
        done();
    });
};