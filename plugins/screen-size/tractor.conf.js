module.exports = {
    port: 4500,
    environments: [
        'http://localhost:5401'
    ],
    plugins: [
        'browser',
        'mocha-specs',
        'page-objects',
        'screen-size'
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
    },
    screenSizes: {
        sm: 400,
        md: 768,
        lg: 1024
    }
};
