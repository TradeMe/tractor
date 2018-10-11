/*{"name":"tractor","elements":[],"actions":[{"name":"go home","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var Tractor = function Tractor() {
    };
    Tractor.prototype.goHome = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return browser.get('/', null);
        });
        return result;
    };
    return Tractor;
}();