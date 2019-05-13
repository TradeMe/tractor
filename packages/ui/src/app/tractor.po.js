/*{"name":"tractor","elements":[],"actions":[{"name":"go home","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var Tractor = function Tractor() {
    };
    Tractor.prototype.goHome = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return browser.get('/');
        });
        return result;
    };
    return Tractor;
}();
