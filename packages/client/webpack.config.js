const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "packages/client/ui/index.html",
});

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
  analyzerMode: "static",
  reportFilename: "../logs/report.html",
  openAnalyzer: false,
});

const normalModuleReplacementPlugin = new webpack.NormalModuleReplacementPlugin(
  /moment-timezone\/data\/packed\/latest\.json/,
  path.resolve(__dirname, "../../misc/timezone-definitions/latest.json"),
);

const ignorePlugin = new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ });

// ここで何も設定しなくてもprocess.env.NODE_ENVはインジェクトされる
const definePlugin = new webpack.DefinePlugin({});

module.exports = {
  entry: path.resolve(__dirname, "ui/index.tsx"),
  devtool: "source-map",
  target: "web",
  output: {
    path: path.resolve(__dirname, "../../dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "../tsconfig.json",
          },
        },
      },
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    definePlugin,
    bundleAnalyzerPlugin,
    normalModuleReplacementPlugin,
    ignorePlugin,
  ],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  devServer: {
    contentBase: `${__dirname}/dist`,
    port: 3001,
  },
};
