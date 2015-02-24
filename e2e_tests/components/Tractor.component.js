module.exports = function () {
    var Tractor = function Tractor() {
        this.title = element(by.css('head > title'));
    };
    Tractor.prototype.getTitle = function () {
        var self = this;
        return self.title.getInnerHtml();
    };
    return Tractor;
}();