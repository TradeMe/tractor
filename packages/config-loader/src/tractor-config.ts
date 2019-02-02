export class TractorConfig {
    public cwd = process.cwd();
    public directory = './tractor';
    public environments: Array<string> = [
        'http://localhost:8080'
    ];
    public plugins: Array<string> = [];
    public port = 4000;

    public afterProtractor? (): void | Promise<void> { return void 0; }
    public beforeProtractor? (): void | Promise<void> { return void 0; }
}

export type UserTractorConfig = Partial<TractorConfig>;

export type UserTractorConfigESM = { default: UserTractorConfig };

export type UserTractorConfigModule = UserTractorConfig | UserTractorConfigESM;
