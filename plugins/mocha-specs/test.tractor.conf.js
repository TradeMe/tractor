module.exports = {
    port: 4401,
    environments: [
        'http://localhost:4401'
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
        directory: './test',
        include: {
            tractor: '../../node_modules/@tractor/ui/dist/page-objects/'
        }
    }
};
