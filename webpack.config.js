const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src", "js", "app.js"),
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "my-first-webpack.js",
    assetModuleFilename: "assets/[name][ext]",
  },
  target: ["web", "es5"],

  devServer: {
    port: 8000,
    open: true,
    hot: false,
    static: {
      directory: path.join(__dirname, "dev"),
    },
  },

  optimization: {
    minimizer: [new TerserPlugin({ exclude: /node_modules/ }), new CssMinimizerPlugin()],
  },
  performance: {
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()],
      },
    }),
    new HtmlWebpackPlugin({
      hash: true,
      inject: "body",
      template: "./src/index.ejs",
      filename: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ejs$/i,
        use: ["html-loader", "template-ejs-loader"],
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },

        // test: /\.js$/,
        // loader: "babel-loader",
        // options: {
        //   plugins: ["transform-class-properties", "transform-object-rest-spread"],
        //   // presets: ['env', 'react']
        // },
        // exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      // {
      //   test: /\.php$/,
      //   loaders: ["html-minify", "php-loader"],
      //   use: [
      //     {
      //       loader: "php-config-loader",
      //     },
      //   ],
      // },
      {
        test: /\.(png|gif|jpg|svg)$/i,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
};
