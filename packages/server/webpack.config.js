const path = require("path");
const webpack = require("webpack");

const definePlugin = new webpack.DefinePlugin({});

module.exports = {
  entry: "./packages/server/application/index.ts",
  devtool: "source-map",
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(__dirname, "../../build"),
    filename: "server.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: { configFile: "../tsconfig.json" },
        },
      },
    ],
  },
  plugins: [definePlugin],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  externals: [
    {
      formidable: "commonjs formidable",
    },
  ],
};
