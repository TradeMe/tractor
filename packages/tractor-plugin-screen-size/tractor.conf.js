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
    },
    screenSizes: {
        sm: 360,
        md: 768,
        lg: 1024
    }
};
