const webpack = require('webpack');

module.exports = {
    entry: './src/tractor/client/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist/client/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'ng-annotate-loader'
                }, {
                    loader: 'babel-loader'
                }]
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader' },
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true,
                unsafe: true
            },
            comments: false
        })
    ],
    node: { Buffer: 'mock' }
};
