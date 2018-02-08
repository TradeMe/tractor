module.exports = {
    environments: [
        'http://localhost:4321'
    ],
    pageObjects: {
        directory: './src/tractor/client/',
        include: {
            tractor: './node_modules/@tractor/ui/dist/page-objects/'
        }
    },
    cucumber: {
        reportsDirectory: './reports/tractor'
    }
};
