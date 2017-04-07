export const DEFAULT_CONFIG = {
    directory: './tractor',
    port: 4000,
    environments: [
        'http://localhost:8080'
    ],
    tags: [],
    beforeProtractor: () => {},
    afterProtractor: () => {}
};
