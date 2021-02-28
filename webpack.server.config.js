const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config({
    path: '../.env',
});

const SOURCE = path.resolve('src');
const DIST = path.resolve('dist/.srv');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'node',
    context: SOURCE,

    entry: {
        main: path.resolve(SOURCE, 'server', 'index.ts'),
    },

    output: {
        path: DIST,
        filename: `index.js`,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.server.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|s?css)$/i,
                use: [
                    {
                        loader: 'null-loader',
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },

    optimization: {
        splitChunks: false,
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            'process.env.SERVER_ENV': 'true',
        }),
        new webpack.EnvironmentPlugin({
            VERSION: process.env.npm_package_version,
            MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoidmxhZGlzbGF2ODA1IiwiYSI6ImNpazZ4YmRqbTAweW9oZ20yZm04ZmRzeTMifQ.hgRGsqyTFYiU6BthERsd_Q',
            DOMAIN_MAIN: 'sights.velu.ga',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('public') + '/*',
                    to: path.resolve(DIST, '..', 'public'),
                },
            ],
        }),
    ],
    stats: 'minimal',
};
