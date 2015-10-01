var path = require('path'),
    webpack = require('webpack');

module.exports = {
  cache: true,
  entry: {
    promise: './src/promise.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'promise.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
    ]
  }
}
