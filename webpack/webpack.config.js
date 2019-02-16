var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../www/js'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{loader: 'expose-loader', options: 'Project'}, {loader: 'ts-loader'}]
            },
            {test: /jquery\.js$/, loader: 'expose-loader?jQuery!expose-loader?$'},
        ]
    }
};