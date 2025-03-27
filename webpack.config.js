const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'httpClient',
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this',
    clean: true,
  },
  optimization: {
    minimize: true,
  },
}; 