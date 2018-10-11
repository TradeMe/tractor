module.exports = {
    environments: [
        'http://localhost:4321'
    ],
    mochaSpecs: {
        directory: './src/tractor/client',
        reportsDirectory: './reports/tractor'
    },
    pageObjects: {
        directory: './src/tractor/client/',
        include: {
            tractor: './node_modules/@tractor/ui/dist/page-objects/'
        }
    }
};
