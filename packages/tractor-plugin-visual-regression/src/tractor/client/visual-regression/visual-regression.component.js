// Module:
import { VisualRegressionModule } from '../visual-regression.module';


// Template:
import template from './visual-regression.component.html';

// Styles:
import style from './visual-regression.component.css';

function VisualRegressionController (
    $http,
    $sce,
    realTimeService
) {
    this.$http = $http;
    this.realTimeService = realTimeService;

    this.style = $sce.trustAsHtml(style.toString());

    this.diffs = [];

    this.watchFSChanges();
    this.getDiffs();
}

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

VisualRegressionController.prototype.setSize = function (image, $event) {
    image.width = $event.target.naturalWidth;
    image.height = $event.target.naturalHeight;
};

VisualRegressionModule.component('tractorVisualRegression', {
    controller: VisualRegressionController,
    template
});
