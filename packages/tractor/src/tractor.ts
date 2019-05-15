// Dependencies:
import { loadConfig, TractorConfigInternal } from '@tractor/config-loader';
import { Container, container, TractorDIConstants, TractorDIFunc } from '@tractor/dependency-injection';
import { info } from '@tractor/logger';
import { loadPlugins, TractorPluginInternal } from '@tractor/plugin-loader';
import * as stack from 'callsite';
import * as fkill from 'fkill';
import * as path from 'path';
import * as pkgUp from 'pkg-up';
import { Config as ProtractorConfig } from 'protractor';
import { BrowserOptions, HEADLESS_OPTION } from './browser-options';
import { TractorProtractorParams } from './protractor-params';

export class Tractor {
    public config: TractorConfigInternal;
    public params: TractorProtractorParams;
    public plugins: Array<TractorPluginInternal>;
    public version: string;

    private readonly _di: Container;

    public constructor (cwd: string, configPath?: string) {
        this.config = loadConfig(cwd, configPath);
        this.plugins = loadPlugins(this.config);
        this.params = this._setupParams();

        const { version } = require(pkgUp.sync({ cwd: __dirname })!) as { version: string };
        this.version = version;

        this._di = this._setUpDI({
            config: this.config,
            plugins: this.plugins,
            tractor: this,
            version: this.version,
        });
    }

    // HACK:
    // This is definitely super un-typed, and is another reason to
    // get rid out our shitty DI...
    // tslint:disable-next-line:no-any
    public call <T extends (...args: Array<any>) => any> (func: TractorDIFunc<T>, ...args: Array<any>): ReturnType<T> {
        return this._di.call(func, ...args);
    }

    public constant (constants: TractorDIConstants): void {
        this._di.constant(constants);
    }

    public plugin (protractorConfig: ProtractorConfig): ProtractorConfig {
        // This is a bit confusing. The `params` object on `protractorConfig` tells
        // Protractor that there are some parameters that might be passed in from the command line.
        protractorConfig.params = protractorConfig.params || {};
        const paramsConfig = protractorConfig.params as TractorProtractorParams;
        paramsConfig.debug = paramsConfig.debug || false;

        // `this.params` refers to the actual parameters that are passed in.
        if (this.params.debug) {
            this._setupDebugMode(protractorConfig);
        }

        // Run the plugin step for each plugin.
        this.plugins.forEach(plugin => plugin.plugin(protractorConfig));

        if (!this.params.kill) {
            return protractorConfig;
        }

        // Add a failsafe for killing browser driver processes:
        const afterLaunch = protractorConfig.afterLaunch;
        protractorConfig.afterLaunch = async function (exitCode: number): Promise<void> {
            if (afterLaunch) {
                afterLaunch.call(this, exitCode);
            }
            const options = {
                force: true,
                ignoreCase: true
            };
            info('Attempting to kill any remaining browser driver proccesses');
            try {
                await fkill('chromedriver', options);
            } catch {
                // Oh well.
            }
            try {
                await fkill('geckodriver', options);
            } catch {
                // Oh well.
            }
        };
        return protractorConfig;
    }

    private _castParam (param: unknown): boolean | unknown {
        if (param === 'false') {
            return false;
        }
        if (param === 'true') {
            return true;
        }
        return param;
    }

    private _setupDebugMode (protractorConfig: ProtractorConfig): void {
        if (protractorConfig.multiCapabilities) {
            const [firstCapability] = protractorConfig.multiCapabilities;
            protractorConfig.capabilities = firstCapability as typeof protractorConfig.capabilities;
            delete protractorConfig.multiCapabilities;
        }
        if (protractorConfig.capabilities) {
            const { capabilities } = protractorConfig;
            capabilities.shardTestFiles = false;
            capabilities.maxInstances = 1;

            const options = (capabilities.chromeOptions || capabilities['moz:firefoxOptions']) as BrowserOptions;
            if (options.args && options.args.includes(HEADLESS_OPTION as string)) {
                options.args.splice(options.args.indexOf(HEADLESS_OPTION as string), 1);
            }
        }
    }

    private _setUpDI (constants: TractorDIConstants): Container {
        const di = container();
        di.constant(constants);
        return di;
    }

    private _setupParams (): TractorProtractorParams {
        // Hack:
        // Let's lean on the fact that Protractor uses Optimist for its
        // CLI parsing, and use the same params object.
        // This could break in the future if the Protractor parameter parsing changes.
        // tslint:disable:no-unsafe-any
        const params = require('optimist').argv.params || {};
        const kill = this._castParam(params.kill);
        const debug = this._castParam(params.debug);
        // tslint:enable:no-unsafe-any
        return {
            debug: debug !== null ? !!debug : false,
            kill: kill !== null ? !!kill : true
        };
    }
}

export function tractor (configPath?: string): Tractor {
    const [, callee] = stack();
    const cwd = path.dirname(callee.getFileName());
    return new Tractor(cwd, configPath);
}
