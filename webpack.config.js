var webpack = require('webpack');

var entrySources = process.env.NODE_ENV !== "production" ?
  [
    "./src/index.js",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server"
  ] :
  [
    "./src/index.js"
  ];

module.exports = {
  entry: {
    index: entrySources
  },
  output: {
    publicPath: "http://localhost:8080/",
    filename: "public/bundle.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.monk$/, loader: 'monkberry-loader'
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        excude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ]
};
