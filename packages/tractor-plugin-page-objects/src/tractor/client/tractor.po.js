/*{"name":"tractor","elements":[],"actions":[{"name":"go home","parameters":[]},{"name":"go to page objects","parameters":[]},{"name":"get url","parameters":[]}],"version":"0.5.0"}*/
module.exports = function () {
    var Tractor = function Tractor() {
    };
    Tractor.prototype.goHome = function () {
        var self = this;
        var result;
        result = browser.get('/', null);
        return result;
    };
    Tractor.prototype.goToPageObjects = function () {
        var self = this;
        var result;
        result = browser.get('/page-objects', null);
        return result;
    };
    Tractor.prototype.getUrl = function () {
        var self = this;
        var result;
        result = browser.getCurrentUrl();
        return result;
    };
    return Tractor;
}();