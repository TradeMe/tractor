export async function run (
    pageObjectsFileStructure,
    includeFileStructures
) {
    await Promise.all(includeFileStructures.map(fileStructure => {
        pageObjectsFileStructure.referenceManager.addFileStructure(fileStructure);
        return fileStructure.read();
    }));
    return pageObjectsFileStructure.read();
}
run['@Inject'] = ['pageObjectsFileStructure', 'includeFileStructures'];
