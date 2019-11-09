const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const css = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
};

const ts = {
  test: /\.ts(x)?$/,
  use: [
    {
      loader: 'ts-loader',
    },
  ],
};

const assets = {
  test: /\.(png|jpe?g|gif|ico)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'images',
        publicPath: 'images',
        name: '[name].[ext]',
      },
    },
  ],
}

const config = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [css, ts, assets],
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
