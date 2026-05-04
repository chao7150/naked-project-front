const path = require("node:path");

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src/ui/index.tsx"),
  devtool: "source-map",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json",
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
  devServer: {
    static: `${__dirname}/dist`,
    port: 3001,
    client: {
      overlay: false,
    },
  },
};
