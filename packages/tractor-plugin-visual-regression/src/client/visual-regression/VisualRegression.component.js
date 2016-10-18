/* global angular:true */

// Utilities:
var fs = require('fs');

var VisualRegressionController = (function () {
    var VisualRegressionController = function VisualRegressionController (
        $http
    ) {
        this.$http = $http;
        this.sets = [];

        $http.get('/fs/visual-regression/changes/')
        .then(function (changes) {
            getSets.call(this, changes);
            getSetUrls.call(this);
        }.bind(this));
    };

    VisualRegressionController.prototype.takeChanges = function (set) {
        this.$http.put('/visual-regression/take-changes', {
            path: set.path
        });
    }

    function getSets (directory) {
        this.sets = this.sets.concat(directory.files);
        directory.directories.forEach(getSets.bind(this));
    }

    function getSetUrls () {
        this.sets.map(function (set) {
            set.baselineUrl = set.url.replace(/changes/, 'baseline');
            set.changesUrl = set.url;
            set.diffUrl = set.url.replace(/changes/, 'diffs');
        });
    }

    let styles = fs.readFileSync(__dirname + '/visual-regression.css', 'utf8');
    VisualRegressionController.prototype.style = styles;

    return VisualRegressionController;
})();

module.exports = angular.module('tractor-visual-regression', [])
.directive('tractorVisualRegression', function () {
    return {
        controller: VisualRegressionController,
        controllerAs: '$ctrl',
        restrict: 'E',
        /* eslint-disable no-path-concat */
        template: fs.readFileSync(__dirname + '/visual-regression.html', 'utf8')
        /* eslint-enable no-path-concat */
    };
});
