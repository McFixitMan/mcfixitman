const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const rewireBabelLoader = require('craco-babel-loader');
const WebpackBar = require('webpackbar');
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const { } = require('@craco/craco');

// Uncomment to prevent the client window from opening when it first builds/runs
process.env.BROWSER = 'none';

module.exports = {
    eslint: {
        enable: true,
        mode: 'file',
    },
    babel: {
        presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
        plugins: ['@emotion/babel-plugin'],
    },
    plugins: [
        {
            // Include our shared project when compiling/hot reloading
            plugin: rewireBabelLoader,
            options: {
                includes: [resolveApp('../mcfixitman.shared')],
            },
        },

    ],
    webpack: {
        plugins: [
            // Adds a progress bar to the webpack builds
            new WebpackBar({ name: 'Building Client' }),

            // Uncomment to analyze CRA bundle
            // new BundleAnalyzerPlugin({ openAnalyzer: true })
        ],
    },
};