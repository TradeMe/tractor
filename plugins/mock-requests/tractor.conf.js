module.exports = {
    port: 4700,
    environments: [
        'http://localhost:4701'
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
