/* global angular:true */

// Utilities:
var fs = require('fs');

var VisualRegressionController = (function () {
    var VisualRegressionController = function VisualRegressionController (
        $http,
        fileStructureService,
        realTimeService
    ) {
        'ngInject';

        this.$http = $http;
        this.fileStructureService = fileStructureService;
        this.realTimeService = realTimeService;

        this.diffs = [];

        this.watchFSChanges();
        this.getDiffs();
    };

    VisualRegressionController.prototype.watchFSChanges = function () {
        this.realTimeService.connect('watch-visual-regression', {
            'visual-regression-change': this.getDiffs.bind(this)
        });
    };

    VisualRegressionController.prototype.getDiffs = function () {
        this.$http.get('/visual-regression/get-diffs')
        .then(function (diffs) {
            this.diffs = diffs.diffs;
        }.bind(this));
    };

    VisualRegressionController.prototype.takeChanges = function (diff) {
        this.$http.put('/visual-regression/take-changes', {
            diff: diff
        })
        .then(function () {
            let index = this.diffs.indexOf(diff);
            this.diffs.splice(index, 1);
        }.bind(this));
    };

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
