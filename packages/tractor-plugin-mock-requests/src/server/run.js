// Dependencies:
export default function run (
    mockRequestsFileStructure
) {
    return mockRequestsFileStructure.read();
}
run['@Inject'] = ['mockRequestsFileStructure'];
