module.exports = {
    mode: "development",
    entry: "./scripts/index.js",
    output: {
        filename: "bundle.js",
    },
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devServer: {
        writeToDisk: true,
    },
};