module.exports = {
    environments: [
        'http://localhost:4321'
    ],
    pageObjects: {
        directory: './src/tractor/client/'
    },
    cucumber: {
        reportsDirectory: './reports/tractor'
    }
};
