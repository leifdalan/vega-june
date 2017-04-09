require('babel-polyfill');

// Webpack config for creating the production bundle.
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');
var purify = require("purifycss-webpack-plugin")
var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(projectRootPath, './static/dist');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var S3Plugin = require('webpack-s3-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var config = require('config');
var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      // 'bootstrap-sass!./src/theme/bootstrap.config.prod.js',
      // 'font-awesome-webpack!./src/theme/font-awesome.config.prod.js',
      './src/client.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: config.publicAssetPath,
    // publicPath: '/dist/'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      // {
      //   test: /\.less$/,
      //   loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=3&sourceMap!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
      // },
      // {
      //   test: /(\.scss$|\.css$)/,
      //   loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=3&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
      // },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel'] },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    // new CleanPlugin([assetsPath], { root: projectRootPath }),

    // css files from the extract-text-plugin loader
    // new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
    // new purify({
    //   basePath: __dirname,
    //   paths: [
    //     'static/dist/**/*',
    //   ],
    //   purifyOptions: {
    //     minify: true,
    //     info: true,
    //   }
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      __TEST__: false,
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    // new LodashModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {comments: false},
      comments: false
    }),
    new Visualizer(),
    new CompressionPlugin({
      asset: "[path][query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.ttf$|\.eot$|\.svg$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new S3Plugin({
      // Only upload css and js
      include: /.*\.(css|js|woff|woff2|ttf|eot|svg|html)/,
      directory: assetsPath,
      // s3Options are required
      s3Options: {
        accessKeyId: config.awsKey,
        secretAccessKey: config.awsSecret,
      },
      s3UploadOptions: {
        Bucket: config.awsBucket,
        // ContentType: function(fileName) {
        //   console.error('fileName', fileName);
        //   if (/\.js/.test(fileName))
        //     return 'application/javascript'
        //   else if (/\.css/.test(fileName))
        //     return 'text/css'
        //   else if (/\.woff/.test(fileName))
        //     return 'application/font-woff'
        //   else if (/\.woff2/.test(fileName))
        //     return 'application/font-woff'
        //   else if (/\.ttf/.test(fileName))
        //     return 'font/ttf'
        //   else if (/\.svg/.test(fileName))
        //     return 'image/svg+xml'
        // },
        ContentEncoding: function(fileName) {
          if (/.*\.(css|js|ttf|eot|svg)/.test(fileName))
            return 'gzip'
        }
      }
    }),

    webpackIsomorphicToolsPlugin
  ]
};
