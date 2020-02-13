const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ts = {
  test: /\.ts(x)?$/,
  use: [
    {
      loader: 'ts-loader',
    },
  ],
};

const config = {
  entry: './test/testRun/main.ts',
  output: {
    path: path.resolve(__dirname, 'testDist/'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [ts],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Render',
      filename: 'index.html',
      inject: 'body',
      meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      minify: /staging/.test(process.env.NODE_ENV),
    }),
  ],
  resolve: {
    extensions: [' ', '.js', '.jsx', '.ts', '.tsx'],
  },
};
module.exports = config;
