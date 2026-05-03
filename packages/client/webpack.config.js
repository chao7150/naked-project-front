const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("node:path");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "packages/client/ui/index.html",
});

const definePlugin = new webpack.DefinePlugin({});

module.exports = {
  mode: "production",
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
  plugins: [htmlWebpackPlugin, definePlugin],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  devServer: {
    static: `${__dirname}/dist`,
    port: 3001,
  },
};
