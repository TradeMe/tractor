// Dependencies:
import { TractorConfig } from './tractor-config';

export const DEFAULT_TRACTOR_CONFIG: TractorConfig = {
    cwd: process.cwd(),
    directory: './tractor',
    environments: [
        'http://localhost:8080'
    ],
    plugins: [],
    port: 4000,

    afterProtractor (): void {
        return;
    },
    beforeProtractor (): void {
        return;
    }
};
