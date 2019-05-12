// Dependencies:
import { TractorConfig } from '@tractor/config-loader';

// Constants:
const DEFAULT_DIRECTORY = './tractor/mocha-specs';
const DEFAULT_REPORT_DIRECTORY = './tractor/reports';

export function config (tractorConfig: TractorMochaSpecsConfig): TractorMochaSpecsConfigInternal {
    tractorConfig.mochaSpecs = tractorConfig.mochaSpecs || {};
    let { mochaSpecs } = tractorConfig;
    mochaSpecs.directory = mochaSpecs.directory || DEFAULT_DIRECTORY;
    mochaSpecs.reportsDirectory = mochaSpecs.reportsDirectory || DEFAULT_REPORT_DIRECTORY;
    return tractorConfig as TractorMochaSpecsConfigInternal;
}

export type MochaSpecsConfigInternal = {
    directory: string;
    reportsDirectory: string
}

export type TractorMochaSpecsConfigInternal = {
    mochaSpecs: MochaSpecsConfigInternal
};

export type TractorMochaSpecsConfig = TractorConfig & Partial<{
    mochaSpecs: Partial<MochaSpecsConfigInternal>;
}>;
