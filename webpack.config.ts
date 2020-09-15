import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration, RuleSetRule } from "webpack";
import { Options as tsOptions } from "ts-loader";

const tsOpt: Partial<tsOptions> = {
  configFile: "test.tsconfig.json",
};

const ts: RuleSetRule = {
  test: /\.ts(x)?$/,
  use: [
    {
      loader: "ts-loader",
      options: tsOpt,
    },
  ],
};

const config: Configuration = {
  devtool: "inline-source-map",
  entry: "./test/testRun/main.ts",
  output: {
    path: path.resolve(__dirname, "testDst/"),
    filename: "js/bundle.js",
  },
  module: {
    rules: [ts],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Render",
      filename: "index.html",
      inject: "body",
      meta: {
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      minify: true,
    }),
  ],
  resolve: {
    extensions: [" ", ".js", ".jsx", ".ts", ".tsx"],
  },
};
export default config;
