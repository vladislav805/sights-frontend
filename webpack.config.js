const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SOURCE = path.resolve('src');
const DIST = path.resolve('dist');
const PUBLIC_STATIC = 'static/js/';


const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

const time = Date.now();

module.exports = {
    mode,
    target: 'web',
    context: SOURCE,

    entry: {
        main: path.resolve(SOURCE, 'index.tsx'),
    },

    output: {
        path: DIST,
        filename: `${PUBLIC_STATIC}[name].js`,
        chunkFilename: `${PUBLIC_STATIC}[name].js?nc=${time}`,
        publicPath: `/`,
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
                        loader: MiniCssExtractPlugin.loader,
                    },
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
                type: 'asset/resource',
                generator: {
                    filename: `static/images/[hash][ext]`,
                },
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
                },
            }),
        ],
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.DefinePlugin({
            'process.env.SERVER_ENV': 'false',
        }),
        new webpack.EnvironmentPlugin({
            VERSION: process.env.npm_package_version,
            GOOGLE_RECAPTCHA_SITE_KEY: '6Lc7iK4UAAAAAI0FfeciBBpja2mIEsK2FRoMN27_',
            MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoidmxhZGlzbGF2ODA1IiwiYSI6ImNpazZ4YmRqbTAweW9oZ20yZm04ZmRzeTMifQ.hgRGsqyTFYiU6BthERsd_Q',
       }),
        new MiniCssExtractPlugin({
            filename: `static/css/[name].css`,
            chunkFilename: `static/css/[name].css`,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('public', 'index.html'),
            chunks: ['main'],
            minify: true,
            filename: 'index.html',
        }),
        ...(!isProduction ? [new webpack.HotModuleReplacementPlugin()] : []),
        new CopyWebpackPlugin({
            patterns: [{
                context: 'static-root',
                from: '**/*',
                //to: DIST + '/',
            }],
        })
    ],

    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
        contentBase: path.resolve('dist'),
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        historyApiFallback: true,
        // disableHostCheck: true,
        allowedHosts: [
            'local.sights.velu.ga',
        ],
    },

    stats: 'minimal',
};
