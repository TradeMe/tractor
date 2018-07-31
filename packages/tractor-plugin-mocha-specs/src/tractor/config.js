// Constants:
const DEFAULT_DIRECTORY = './tractor/mocha-specs';
const DEFAULT_REPORT_DIRECTORY = './tractor/reports';

export function config (tractorConfig) {
    tractorConfig.mochaSpecs = tractorConfig.mochaSpecs || {};
    let { mochaSpecs } = tractorConfig;
    mochaSpecs.directory = mochaSpecs.directory || DEFAULT_DIRECTORY;
    mochaSpecs.reportsDirectory = mochaSpecs.reportsDirectory || DEFAULT_REPORT_DIRECTORY;
    return mochaSpecs;
}
