export type TractorConfig = {
    cwd: string;
    directory: string;
    environments: Array<string>;
    plugins: Array<string>;
    port: number;

    afterProtractor (): void | Promise<void>;
    beforeProtractor (): void | Promise<void>;
};

export type UserTractorConfig = Partial<TractorConfig>;

export type UserTractorConfigESM = { default: UserTractorConfig };

export type UserTractorConfigModule = UserTractorConfig | UserTractorConfigESM;
