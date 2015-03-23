/*{
    "name": "Tractor",
    "elements": [
        {
            "name": "title"
        }
    ],
    "actions": [
        {
            "name": "get title"
        },
        {
            "name": "get"
        }
    ]
}*/
module.exports = function () {
    var Tractor = function Tractor() {
        this.title = element(by.css('head > title'));
    };
    Tractor.prototype.getTitle = function () {
        var self = this;
        return self.title.getInnerHtml();
    };
    Tractor.prototype.get = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(browser.get('http://localhost:3000', null));
        });
    };
    return Tractor;
}();