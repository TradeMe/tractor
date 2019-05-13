// Dependencies:
import { loadConfig, TractorConfigInternal } from '@tractor/config-loader';
import { Container, container, TractorDIConstants, TractorDIFunc } from '@tractor/dependency-injection';
import { loadPlugins, TractorPluginInternal } from '@tractor/plugin-loader';
import * as stack from 'callsite';
import * as path from 'path';
import * as pkgUp from 'pkg-up';
import { Config as ProtractorConfig } from 'protractor';
import { TractorProtractorParams } from './protractor-params.js';

export class Tractor {
    public config: TractorConfigInternal;
    public plugins: Array<TractorPluginInternal>;
    public version: string;

    private readonly _di: Container;

    public constructor (cwd: string, configPath?: string) {
        this.config = loadConfig(cwd, configPath);
        this.plugins = loadPlugins(this.config);

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
        protractorConfig.params = protractorConfig.params || {};
        (protractorConfig.params as TractorProtractorParams).debug = false;
        this.plugins.forEach(plugin => plugin.plugin(protractorConfig));
        return protractorConfig;
    }

    private _setUpDI (constants: TractorDIConstants): Container {
        const di = container();
        di.constant(constants);
        return di;
    }
}

export function tractor (configPath?: string): Tractor {
    const [, callee] = stack();
    const cwd = path.dirname(callee.getFileName());
    return new Tractor(cwd, configPath);
}
