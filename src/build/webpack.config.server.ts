import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import { WebpackClusterPlugin } from './webpack/WebpackClusterPlugin';

import { LAZY_COMPONENT_PLUGIN } from './babel/lazyComponentBabelPlugin';

import defaultConfig from './webpack.config.common';

export default merge(defaultConfig, {
    name: 'server',
    entry: path.resolve('src/server/index.ts'),

    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        libraryTarget: 'commonjs2',
    },

    externals: {
        fs: 'commonjs fs',
        path: 'commonjs path',
        react: 'commonjs react',
        express: 'commonjs express',
        'unsplash-js': 'commonjs unsplash-js',
        'node-fetch': 'commonjs node-fetch',
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
                                    cacheDirectory: path.resolve('node_modules/.cache/babel-server'),
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
                                                loose: true,
                                                modules: false,
                                                targets: {
                                                    node: true,
                                                },
                                            },
                                        ],
                                        ['@babel/preset-typescript', {}],
                                        ['@babel/preset-react', {}],
                                    ],
                                    plugins: [
                                        LAZY_COMPONENT_PLUGIN,
                                        '@babel/plugin-proposal-class-properties',
                                        '@babel/plugin-transform-runtime',
                                    ],
                                },
                            },
                        ],
                    },

                    {
                        test: /\.scss$/,
                        loader: 'null-loader',
                    },
                ],
            },
        ],
    },

    plugins: [
        new WebpackClusterPlugin({ filename: 'main.js' }),
        new webpack.DefinePlugin({
            'typeof window': '"undefined"',
        }),
    ],
});
