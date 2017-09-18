export function run (
    pageObjectsFileStructure
) {
    return pageObjectsFileStructure.read();
}
run['@Inject'] = ['pageObjectsFileStructure'];
