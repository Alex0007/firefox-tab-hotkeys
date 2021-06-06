const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = "development";
}
const ENV = (process.env.ENV = process.env.NODE_ENV);

const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      "./src/manifest.json",
      {
        from: "src/icons",
        to: "icons",
      },
    ],
  }),
  new webpack.SourceMapDevToolPlugin({
    include: ["background.js"],
  }),
  new webpack.DefinePlugin({
    "process.env": {
      ENV: JSON.stringify(ENV),
    },
  }),
];

const config = {
  mode: ENV,
  devtool: false,
  entry: {
    background: "./src/background.ts",
    shortcuts: "./src/shortcuts.ts",
    // 'message_handler': './src/message_handler.ts',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".ts", ".js"],
    symlinks: false,
    modules: [path.resolve("node_modules")],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: plugins,
};

module.exports = config;
