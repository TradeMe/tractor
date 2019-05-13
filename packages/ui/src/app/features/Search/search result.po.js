/*{"name":"search result","elements":[{"name":"link"}],"actions":[{"name":"go to result","parameters":[]}],"version":"1.4.0"}*/
module.exports = function () {
    var SearchResult = function SearchResult(host) {
        var find = host ? host.element.bind(host) : element;
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