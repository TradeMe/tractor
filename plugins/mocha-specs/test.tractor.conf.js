module.exports = {
    port: 4401,
    environments: [
        'http://localhost:4401'
    ],
    plugins: [
        'page-objects',
        'mocha-specs',
        'mock-requests'
    ],
    pageObjects: {
        directory: './test',
        include: {
            tractor: '../../node_modules/@tractor/ui/dist/page-objects/'
        }
    },
    mochaSpecs: {
        directory: './test'
    },
    mockRequests: {
        directory: './test'
    }
};
