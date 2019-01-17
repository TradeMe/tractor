module.exports = {
    port: 4601,
    environments: [
        'http://localhost:4601'
    ],
    plugins: [
        'browser',
        'mocha-specs',
        'page-objects'
    ],
    mochaSpecs: {
        directory: './test'
    },
    pageObjects: {
        directory: './test'
    }
};
