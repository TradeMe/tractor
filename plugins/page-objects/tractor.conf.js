module.exports = {
    port: 4600,
    environments: [
        'http://localhost:4601'
    ],
    plugins: [
        'browser',
        'mocha-specs',
        'page-objects'
    ],
    mochaSpecs: {
        directory: './src/tractor/client',
        reportsDirectory: './reports/tractor'
    },
    pageObjects: {
        directory: './src/tractor/client/',
        include: {
            tractor: '../../node_modules/@tractor/ui/dist/page-objects/'
        }
    }
};
