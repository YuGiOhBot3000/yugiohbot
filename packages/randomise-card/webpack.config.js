const path = require("path");
const { merge } = require("webpack-merge");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const common = require("../../webpack.common.js");

module.exports = merge(common, {
  resolve: {
    extensions: [".js", ".ts"],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
});
