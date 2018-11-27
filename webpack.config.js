module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        ...require('./babel.config.js'),
                    },
                }]
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader' },
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    mode: 'production',
    node: {
        Buffer: 'mock'
    }
};
