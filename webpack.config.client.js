const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./packages/client/ui/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: "./packages/client/ui/index.tsx",
  devtool: "source-map",
  target: "web",
  output: {
    path: path.resolve("dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  plugins: [htmlWebpackPlugin],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  devServer: {
    contentBase: `${__dirname}/dist`,
    port: 3000,
    proxy: {
      "/api": {
        target: "https://gyokuro.chao.tokyo/api/temperature",
        secure: false,
        pathRewrite: { "^/api": "" },
        changeOrigin: true
      }
    }
  }
};
