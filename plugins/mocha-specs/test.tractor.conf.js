module.exports = {
    port: 4321,
    environments: [
        'http://localhost:4321'
    ],
    pageObjects: {
        directory: './test',
        include: {
            tractor: './node_modules/@tractor/ui/dist/page-objects/'
        }
    },
    mochaSpecs: {
        directory: './test'
    },
    mockRequests: {
        directory: './test'
    }
};
