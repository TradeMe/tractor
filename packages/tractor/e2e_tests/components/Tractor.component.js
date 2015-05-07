/*{
    "name": "Tractor",
    "elements": [],
    "actions": [
        {
            "name": "get",
            "parameters": []
        },
        {
            "name": "refresh",
            "parameters": []
        }
    ]
}*/
module.exports = function () {
    var Tractor = function Tractor() {
    };
    Tractor.prototype.get = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(browser.get('http://localhost:4000', null));
        });
    };
    Tractor.prototype.refresh = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(browser.refresh(null));
        });
    };
    return Tractor;
}();