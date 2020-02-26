const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.(html|css)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.DefinePlugin({
            // global app config object
            config: JSON.stringify({
                // apiUrl: 'https://glsf-msoe-fish.azurewebsites.net/' // Use this in production, and replace it with a correct url to the live website.
                apiUrl: ''
            })
        })
    ],
    devServer: {
        historyApiFallback: true
    }
}