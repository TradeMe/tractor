import { VisualRegressionModule } from '../../visual-regression.module';

VisualRegressionModule.directive('imageload', () => {
    return {
        restrict: 'A',
        scope: {
            imageload: "&"                              
        },
        link: function ($scope, $element) {
            $element.on('load', function ($event) {
                $scope.imageload({ $event: $event });
                $scope.$apply();
            });
        }
    };
});
