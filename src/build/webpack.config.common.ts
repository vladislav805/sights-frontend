import * as Webpack from 'webpack';

import * as path from 'path';

import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isProduction = process.env.NODE_ENV === 'production';

const config: Webpack.Configuration = {
    mode: isProduction ? 'production' : 'development',
    node: false,
    watch: !isProduction,

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        modules: [
            path.resolve('src'),
            path.resolve('node_modules')
        ],
    },

    plugins: isProduction ? [] : [new ForkTsCheckerWebpackPlugin()],
};

export default config;
