const path = require("path");

module.exports = {
  mode: "development",
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
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  externals: [
    {
      formidable: "commonjs formidable",
    },
  ],
};
