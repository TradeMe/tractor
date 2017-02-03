// Constants:
const DEFAULT_DIRECTORY = './e2e-tests';
const DEFAULT_PORT = 4000;
const DEFAULT_ENVIRONMENT = 'http://localhost:8080';
const NOOP = () => {};

export default {
    testDirectory: DEFAULT_DIRECTORY,
    port: DEFAULT_PORT,
    environments: [
        DEFAULT_ENVIRONMENT
    ],
    tags: [],
    beforeProtractor: NOOP,
    afterProtractor: NOOP
};
