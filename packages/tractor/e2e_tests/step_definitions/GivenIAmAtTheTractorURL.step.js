module.exports = function () {
    this.Given(/^I am at the tractor URL$/, function (done) {
        var tasks = browser.get('http://localhost:3000/index.dev.html').then(function () {
            return function () {
                httpBackend.when('GET', /.*/).passThrough();
                httpBackend.when('POST', /.*/).passThrough();
                httpBackend.when('DELETE', /.*/).passThrough();
                httpBackend.when('PUT', /.*/).passThrough();
                httpBackend.when('HEAD', /.*/).passThrough();
                httpBackend.when('PATCH', /.*/).passThrough();
                return httpBackend.flush();
            }();
        });
        Promise.all([tasks]).then(function () {
            done();
        });
    });
};