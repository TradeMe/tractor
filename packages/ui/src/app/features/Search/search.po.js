/*{"name":"search","elements":[{"name":"search input"},{"name":"search results","group":true,"type":"search result"},{"name":"overlay"}],"actions":[{"name":"search","parameters":[{"name":"searchString"}]},{"name":"go to result","parameters":[{"name":"name"}]},{"name":"is present","parameters":[]}],"version":"1.7.0"}*/
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
            return browser.pasteText(self.searchInput, searchString);
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
    Search.prototype.isPresent = function () {
        var self = this;
        var result = Promise.resolve();
        result = result.then(function () {
            return self.searchInput.isPresent();
        });
        return result;
    };
    return Search;
}();