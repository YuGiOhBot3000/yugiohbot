module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  output: {
    libraryTarget: "commonjs",
    filename: "index.js",
  },
  target: "node",
  optimization: {
    usedExports: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        // Include ts files.
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            projectReferences: true,
          },
        },
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
};
