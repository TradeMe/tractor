/*{"name":"tractor","elements":[],"actions":[{"name":"go home","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var Tractor = function Tractor() {
    };
    Tractor.prototype.goHome = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(browser.get('/', null));
        });
    };
    return Tractor;
}();
