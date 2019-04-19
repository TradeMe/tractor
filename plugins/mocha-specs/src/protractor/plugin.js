// Dependencies:
import { useMochaHook } from '@phenomnomnominal/protractor-use-mocha-hook';
import { getConfig } from '@tractor/config-loader';
import { TractorError } from '@tractor/error-handler';
import { exists } from 'fs';
import marge from 'mochawesome-report-generator';
import { merge } from 'mochawesome-merge';
import * as optimist from 'optimist';
import path from 'path';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { browserInfo } from './browser-info';
import { debug } from './debug';
import { setTags } from './tags';
import { world } from './world';

// Constants:
const DEFAULT_SERIAL_REPORTER = 'mochawesome';
const DEFAULT_PARALLEL_REPORTER = 'spec';
const DEFAULT_MULTIPLE_REPORTER = 'mocha-multi-reporters';
const DEFAULT_MOCHAWESOME_OPTIONS = {
    autoOpen: false,
    html: false,
    inline: true,
    json: true,
    overwrite: false
};
const rimrafAsync = promisify(rimraf);
const existsAsync = promisify(exists);

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
    const reportDirOptions = { reportDir: tractorConfig.mochaSpecs.reportsDirectory };

    if (!mochaOpts.reporter) {
        const { capabilities, multiCapabilities } = protractorConfig;
        const isSharded = capabilities && capabilities.shardTestFiles && capabilities.maxInstances > 1;
        const isMultiSharded = multiCapabilities && multiCapabilities.some(capability => capability.shardTestFiles && capabilities.maxInstances > 1);
        mochaOpts.reporter = isSharded || isMultiSharded ? DEFAULT_PARALLEL_REPORTER : DEFAULT_SERIAL_REPORTER;
    }

    let autoOpen = true;
    if (mochaOpts.reporter === DEFAULT_SERIAL_REPORTER) {
        if (mochaOpts.reporterOptions) {
            autoOpen = !!mochaOpts.reporterOptions.autoOpen;
        }
        mochaOpts.reporterOptions = {
            ...DEFAULT_MOCHAWESOME_OPTIONS,
            ...reportDirOptions,
            ...mochaOpts.reporterOptions
        };
    }

    if (mochaOpts.reporter === DEFAULT_MULTIPLE_REPORTER && mochaOpts.reporterOptions && mochaOpts.reporterOptions.reporterEnabled) {
        if (mochaOpts.reporterOptions.reporterEnabled.includes('mochawesome')) {
            mochaOpts.reporterOptions.mochawesomeReporterOptions = {
                ...DEFAULT_MOCHAWESOME_OPTIONS,
                ...reportDirOptions,
                ...mochaOpts.reporterOptions.mochawesomeReporterOptions
            };
        }
    }

    let args = optimist.parse(process.argv.slice(2));
    let params = args && args.params || {};
    if (params && params.tag) {
        setTags(mochaOpts, params.tag);
    }
    if (params && params.spec) {
        protractorConfig.specs = [params.spec];
    }

    protractorConfig.plugins = protractorConfig.plugins || [];
    protractorConfig.plugins.push({
        inline: {
            onPrepare () {
                world();
            },
            postTest: function () {
                // use `function` over `=>` to let Mocha set `this`:
                useMochaHook('afterEach', async function () {
                    await browserInfo(this);
                    debug(this);
                });
            }
        }
    });

    const afterLaunch = protractorConfig.afterLaunch;
    protractorConfig.afterLaunch = async function (...args) {
        const reports = await existsAsync(reportDirOptions.reportDir);
        if (reports) {
            const report = await merge(reportDirOptions);
            await marge.create(report, { autoOpen, ...reportDirOptions });
            await rimrafAsync(path.resolve(reportDirOptions.reportDir, './*.json'));    
        }
        if (afterLaunch) {
            afterLaunch.call(this, ...args);
        }
    };

    return protractorConfig;
}
