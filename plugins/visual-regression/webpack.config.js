const config = require('../../webpack.config');

module.exports = {
    ...config,
    entry: './src/tractor/client/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist/client/'
    }
};
