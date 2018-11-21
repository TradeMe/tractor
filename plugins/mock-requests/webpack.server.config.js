module.exports = {
    entry: {
        "add-mocking": './src/scripts/add-mocking.js',
        "init": './src/scripts/init.js',
        "shim-fetch": './src/scripts/shim-fetch.js',
        "shim-xhr": './src/scripts/shim-xhr.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/scripts/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    mode: 'production',
    node: { Buffer: 'mock' }
};
