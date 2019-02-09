export type TractorConfigInternal = {
    cwd: string;
    directory: string;
    environments: Array<string>;
    plugins: Array<string>;
    port: number;

    afterProtractor (): void | Promise<void>;
    beforeProtractor (): void | Promise<void>;
};

export type TractorConfig = Partial<TractorConfigInternal>;

export type TractorConfigESM = { default: TractorConfig };

export type TractorConfigModule = TractorConfig | TractorConfigESM;
