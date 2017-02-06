export const DEFAULT_CONFIG = {
    testDirectory: './e2e-tests',
    port: 4000,
    environments: [
        'http://localhost:8080'
    ],
    tags: [],
    beforeProtractor: () => {},
    afterProtractor: () => {}
};
