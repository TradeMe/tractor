/*{
    "name": "Given that component path is a pass-through",
    "components": [],
    "mockData": []
}*/
module.exports = function () {
    this.Given(/^that component path is a pass\-through$/, function (done) {
        httpBackend.whenGET(/\/components\/path\?.*/).passThrough();
        done();
    });
};
