module.exports = {
    port: 4400,
    environments: [
        'http://localhost:4401'
    ],
    plugins: [
        'page-objects',
        'mocha-specs'
    ],
    pageObjects: {
        directory: './src/tractor/client/',
        include: {
            tractor: '../../node_modules/@tractor/ui/dist/page-objects/'
        }
    },
    mochaSpecs: {
        directory: './src/tractor/client/',
        reportsDirectory: './reports/tractor'
    }
};
