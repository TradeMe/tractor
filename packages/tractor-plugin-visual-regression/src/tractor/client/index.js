/* global angular:true */

// Module:
import { VisualRegressionModule } from './visual-regression.module';

// Dependencies:
import './visual-regression/visual-regression.component';

let tractor = angular.module('tractor');
tractor.requires.push(VisualRegressionModule.name);

tractor.config((
    // redirectionServiceProvider,
    $stateProvider
) => {
    // redirectionServiceProvider.addFileType('.mock.json', 'mock-requests');

    $stateProvider
    .state('tractor.visual-regression', {
        url: 'visual-regression/',
        template: '<tractor-visual-regression></tractor-visual-regression>'
    });
});
