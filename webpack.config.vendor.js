const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new MiniCssExtractPlugin({ filename: 'vendor.css'});

    return [{
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        entry: {
            vendor: [
                'bootstrap',
                'bootstrap/dist/css/bootstrap.css',
            ],
        },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: isDevBuild ? [ MiniCssExtractPlugin.loader, 'css-loader' ] : [ MiniCssExtractPlugin.loader, 'css-loader?minimize'] },
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        output: { 
            path: path.join(__dirname, 'wwwroot', 'dist'),
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            extractCSS,
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    }];
};
