var path = require('path');
module.exports = {
    output: {
        path: path.resolve(__dirname, '../www/js'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};