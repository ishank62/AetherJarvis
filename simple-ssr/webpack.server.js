const path = require("path");

module.exports = {
  entry: "./src/server/index.js",

  target: "node",

  externals: [],

  output: {
    path: path.resolve("server-build"),
    filename: "index.js",
    library: "index",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: "css-loader",
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};
