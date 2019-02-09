// Dependencies:
import { TractorConfigInternal } from '@tractor/config-loader';
import { Config } from 'protractor';

export type TractorPluginConfig = Pick<TractorConfigInternal, 'cwd'> & Partial<Pick<TractorConfigInternal, 'plugins'>>;

export type TractorValue = {
    description?: string;
    name: string;
    required?: boolean;
    resolves?: 'boolean' | 'number' | 'string' | 'element';
    type: 'promise' | 'boolean' | 'number' | 'string' | 'element';
};

export type TractorAction = {
    deprecated?: boolean;
    description: string;
    name: string;
    parameters?: Array<TractorValue>;
    returns?: 'promise' | 'boolean' | 'number' | 'string' | 'element' | TractorValue;
};

export type TractorPluginFunction = () => Promise<void> | void;

export type TractorDescriptionInternal = TractorDescription & {
    hasUI: boolean;
    name: string;
    url: string;
    variableName: string;
    version: string;
};

export type TractorPluginInternal<T = unknown> = TractorPlugin<T> & {
    description: TractorDescriptionInternal;
    fullName: string;
    name: string;
    script?: string;
};

export type TractorDescription = {
    actions: Array<TractorAction>;
};

// We can't know here what `T` might be, so we default to `unknown`.
// But let's keep it generic cause it might be useful to be able
// to know what type `create()` will return at some point.
export type TractorPlugin<T = unknown> = {
    description: TractorDescription;

    create (): T;
    init (): Promise<void> | void;
    plugin (protractorConfig: Config): Config;
    run (): Promise<void> | void;
    serve (): Promise<void> | void;
    upgrade (): Promise<void> | void;
};

export type UserTractorPluginESM = { default: TractorPlugin };

export type UserTractorPluginModule = TractorPlugin | UserTractorPluginESM;
