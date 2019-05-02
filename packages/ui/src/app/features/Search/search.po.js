/*{"name":"search","elements":[{"name":"search input"},{"name":"search results","type":"search result","group":true},{"name":"overlay"}],"actions":[{"name":"search","parameters":[{"name":"searchString"}]},{"name":"go to result","parameters":[{"name":"name"}]}],"version":"1.4.0"}*/
module.exports = function () {
    var SearchResult = require('./search result.po.js');
    var Search = function Search(host) {
        var find = host ? host.element.bind(host) : element;
        var findAll = host ? host.all.bind(host) : element.all.bind(element);
        this.searchInput = find(by.css('tractor-search form[name="search"] input'));
        this.searchResults = function (groupSelector) {
            return new SearchResult(findAll(by.css('tractor-search ul li')).getFromGroup(groupSelector));
        };
        this.overlay = find(by.css('tractor-search .dialog__wrapper'));
    };
    Search.prototype.search = function (searchString) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.searchInput.sendKeys(searchString);
        });
        return result;
    };
    Search.prototype.goToResult = function (name) {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.searchResults(name).goToResult();
        });
        result = result.then(function () {
            return self.overlay.click();
        });
        return result;
    };
    return Search;
}();