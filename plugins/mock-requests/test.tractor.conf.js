module.exports = {
    port: 4701,
    environments: [
        'http://localhost:4701'
    ],
    plugins: [
        'browser',
        'mocha-specs',
        'mock-requests',
        'page-objects'
    ],
    mochaSpecs: {
        directory: './test'
    },
    mockRequests: {
        directory: './test'
    },
    pageObjects: {
        directory: './test'
    }
};
