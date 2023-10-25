const path = require('path');

module.exports = {
    mode: 'production',
    entry: './app.js',
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: './public',
        filename: 'bundle.js',
    },
    target: 'node',
};