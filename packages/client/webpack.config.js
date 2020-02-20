const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "packages/client/ui/index.html",
});

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
  plugins: [htmlWebpackPlugin, definePlugin],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  devServer: {
    contentBase: `${__dirname}/dist`,
    port: 3000,
    proxy: {
      "/api": {
        target: "https://gyokuro.chao.tokyo/api/temperature",
        secure: false,
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
};
