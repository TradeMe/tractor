export function run (
    visualRegressionFileStructure
) {
    return visualRegressionFileStructure.read();
}
run['@Inject'] = ['visualRegressionFileStructure'];
