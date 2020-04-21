const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const PATH = {
    SRC: path.resolve('src'),
    DIST: path.resolve('dist'),
    ROOT: path.resolve('.'),
    STATIC: 'static',
};
PATH.STATIC_CSS = `${PATH.STATIC}/css`;
PATH.STATIC_IMAGES = `${PATH.STATIC}/images`;

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,
    target: 'node',
    context: PATH.SRC,

    entry: {
        server: path.resolve(PATH.SRC, 'server', 'index.ts'),
    },

    output: {
        path: PATH.DIST,
        filename: `server.js`,
        publicPath: '/',
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
                test: /\.s?css$/i,
                use: [
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: function(url, _res, _context) {
                                return path.relative(
                                    PATH.STATIC_CSS,
                                    PATH.STATIC_IMAGES,
                                ) + '/' + url;
                            },
                            outputPath: `${PATH.STATIC_IMAGES}/`,
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },

    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ie8: false,
                    keep_fnames: false,
                    compress: true,
                    mangle: {
                        toplevel: true,
                    },
                }
            })
        ],
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.EnvironmentPlugin({
            ENV_EXEC: 'server',
            VERSION: process.env.npm_package_version,
            GOOGLE_RECAPTCHA_SITE_KEY: '6Lc7iK4UAAAAAI0FfeciBBpja2mIEsK2FRoMN27_',
            MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoidmxhZGlzbGF2ODA1IiwiYSI6ImNpazZ4YmRqbTAweW9oZ20yZm04ZmRzeTMifQ.hgRGsqyTFYiU6BthERsd_Q',
        }),
    ],

    devtool: '#sourcemap',
    stats: 'minimal',
};
