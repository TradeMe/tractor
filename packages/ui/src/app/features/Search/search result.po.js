/*{"name":"search result","elements":[{"name":"link"}],"actions":[{"name":"go to result","parameters":[]}],"version":"0.5.2"}*/
module.exports = function () {
    var SearchResult = function SearchResult(parent) {
        var find = parent ? parent.element.bind(parent) : element;
        this.link = find(by.css('a.search__link'));
    };
    SearchResult.prototype.goToResult = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.link.click();
        });
        return result;
    };
    return SearchResult;
}();