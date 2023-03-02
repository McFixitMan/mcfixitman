const path = require('path');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    externals: [
        'pg',
        'sqlite3',
        'pg-hstore',
        'bufferutil',
        'utf-8-validate',
        'encoding',
        'dtrace-provider',
        'erlpack',
        'zlib-sync',
    ],
    mode: 'production',
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'deploy'),
        publicPath: '/deploy/',
        filename: 'index.js'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                    keep_classnames: true,
                    keep_fnames: true,
                }
            }),
        ],
    },
    plugins: [
        new ESLintPlugin({
            failOnError: true,
            failOnWarning: false,
            emitWarning: true,
        }),
        // Copy assets to the built folder so that email templates have access to them
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: 'src/utility/mail/assets', to: 'assets'
        //         }
        //     ]
        // }),
        // BundleAnalyzerPlugin spins up a webserver to display bundle sizes, uncomment below to turn on
        // new BundleAnalyzerPlugin(),

        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$|^utf-8-validate$|^bufferutil$|^encoding$/ }),
        // Filter out unused drivers
        new FilterWarningsPlugin({
            exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg-native/, /pg-query-stream/, /react-native/, /platform/, /redis/, /sqlite3/]
        }),
        new WebpackBar({ name: 'Building API (prod)' }),
    ],
    resolve: {
        mainFields: ['main'],
        extensions: ['.ts', '.js'],
        // Support our tsconfig aliases
        plugins: [new TsConfigPathsPlugin()],
    },
    stats: {
        warnings: true,
    },
}