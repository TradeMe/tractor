'use strict';

// Utilities:
var fs = require('fs');

// Styles:
var style = fs.readFileSync(__dirname + '/search.css', 'utf8')

// Module:
var Search = require('./Search');

var SearchController = (function () {
    var SearchController = function SearchController (
        $sce,
        $scope,
        searchService
    ) {
        this.style = $sce.trustAsHtml(style);
        this.searchService = searchService;

        this.searchString = '';
        this.results = [];
    };

    SearchController.prototype.doSearch = function () {
        this.searchService.search(this.searchString)
        .then(function (search) {
            this.results = search.results;
            this.count = search.count;
        }.bind(this));
    };

    SearchController.prototype.hideSearch = function () {
        this.show = false;
    };

    SearchController.prototype.swallowClick = function ($event) {
        $event.stopPropagation();
    };

    return SearchController;
})();

Search.component('tractorSearch', {
    bindings: {
        show: '='
    },
    /* eslint-disable no-path-concat */
    template: fs.readFileSync(__dirname + '/Search.html', 'utf8'),
    /* eslint-enable no-path-concat */
    controller: SearchController
});
