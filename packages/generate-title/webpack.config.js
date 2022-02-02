const path = require("path");
const { merge } = require("webpack-merge");

const common = require("../../webpack.common.js");

module.exports = merge(common, {
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
});
