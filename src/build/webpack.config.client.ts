import * as webpack from 'webpack';
import * as path from 'path';
import * as merge from 'webpack-merge';
import * as WebpackManifestPlugin from 'webpack-manifest-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { LAZY_COMPONENT_PLUGIN } from './babel/lazyComponentBabelPlugin';

import defaultConfig from './webpack.config.common';

const PUBLIC_PATH = '/assets/';
const isProduction = process.env.NODE_ENV === 'production';

console.log(path.resolve('src/client/index.ts'));

export default merge(defaultConfig, {
    name: 'client',
    entry: path.resolve('src/client/index.ts'),

    output: {
        path: path.resolve('dist/client/assets'),
        filename: isProduction ? '[contenthash:8].js' : '[name].js',
        chunkFilename: isProduction ? '_[contenthash:8].js' : '_[name].js',
        publicPath: PUBLIC_PATH,
    },

    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.tsx?$/,
                        include: [path.resolve('src')],
                        use: [
                            {
                                loader: 'cache-loader',
                                options: {
                                    cacheDirectory: path.resolve('node_modules/.cache/babel-client'),
                                },
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    babelrc: false,

                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                modules: false,
                                                loose: true,
                                                useBuiltIns: 'usage',
                                                corejs: 3,
                                            },
                                        ],
                                        ['@babel/preset-react', {}],
                                        ['@babel/preset-typescript', {}],
                                    ],
                                    plugins: [
                                        LAZY_COMPONENT_PLUGIN,
                                        '@babel/plugin-proposal-class-properties',
                                        '@babel/plugin-transform-runtime',
                                        'babel-plugin-optimize-react',
                                    ],
                                },
                            },
                        ],
                    },

                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'cache-loader',
                                options: {
                                    cacheDirectory: path.resolve('node_modules/.cache/babel-client'),
                                },
                            },
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: isProduction ? '[contenthash:8].css' : '[name].css',
            chunkFilename: isProduction ? '_[contenthash:8].css' : '_[name].css',
        }),

        new WebpackManifestPlugin({
            fileName: '../../asset-manifest.json',
            publicPath: PUBLIC_PATH,
            generate(seed, files) {
                const manifestFiles = files.reduce(function(manifest, file) {
                    if (file.name) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        manifest[file.name] = file.path;
                    }

                    return manifest;
                }, seed);

                return {
                    files: manifestFiles,
                };
            },
        }),

        new webpack.DefinePlugin({
            'typeof window': '"object"',
        }),

        ...(isProduction ? [new OptimizeCssAssetsPlugin()] : []),
    ],
});