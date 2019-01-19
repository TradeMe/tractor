// Dependencies:
import { getConfig } from '@tractor/config-loader';
import { TractorError } from '@tractor/error-handler';
import * as optimist from 'optimist';
import path from 'path';
import { setTags } from './tags';
import { world } from './world';

// Constants:
const DEFAULT_SERIAL_REPORTER = 'mochawesome';
const DEFAULT_PARALLEL_REPORTER = 'spec';
const HOOKS_FILE_PATH = path.resolve(__dirname, './hooks.js');

export function plugin (protractorConfig) {
    if (protractorConfig.framework) {
        throw new TractorError('Cannot configure `mocha`. `framework` is already set in protractor config.');
    }

    let tractorConfig = getConfig();

    let specGlob = path.join(process.cwd(), tractorConfig.mochaSpecs.directory, '**/*.e2e-spec.js');

    protractorConfig.framework = 'mocha';
    protractorConfig.specs = protractorConfig.specs || [specGlob];

    protractorConfig.mochaOpts = protractorConfig.mochaOpts || {};
    let { mochaOpts } = protractorConfig;

    // if (!mochaOpts.reporter) {
    //     const { capabilities, multiCapabilities } = protractorConfig;
    //     const isSharded = capabilities && capabilities.shardTestFiles;
    //     const isMultiSharded = multiCapabilities && multiCapabilities.some(capability => capability.shardTestFiles);
    //     mochaOpts.reporter = isSharded || isMultiSharded ? DEFAULT_PARALLEL_REPORTER : DEFAULT_SERIAL_REPORTER;
    // }
    // if (mochaOpts.reporter === DEFAULT_SERIAL_REPORTER) {
    //     mochaOpts.reporterOptions = {
    //         autoOpen: true,
    //         reportDir: tractorConfig.mochaSpecs.reportsDirectory,
    //         ...mochaOpts.reporterOptions
    //     };
    // }

    let args = optimist.parse(process.argv.slice(2));
    let params = args && args.params || {};
    if (params && params.tag) {
        setTags(mochaOpts, params.tag);
    }
    if (params && params.spec) {
        protractorConfig.specs = [params.spec];
    }

    protractorConfig.specs.unshift(HOOKS_FILE_PATH);

    protractorConfig.plugins = protractorConfig.plugins || [];
    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                world();
            }
        }
    });

    return protractorConfig;
}
