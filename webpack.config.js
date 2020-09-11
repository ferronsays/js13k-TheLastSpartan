const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const isProduction = process.env.npm_lifecycle_event === "build";

module.exports = {
  entry: "./src",
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          ecma: 2020,
          mangle: {
            module: true,
            properties: {
              regex: /^_/,
            },
          },
          module: true,
          compress: {
            toplevel: true,
            module: true,
            passes: 10,
            unsafe_arrows: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_symbols: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true,
          },
        },
      }),
    ],
  },
  devtool: !isProduction && "source-map",
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: isProduction && {
        collapseWhitespace: true,
      },
      inlineSource: isProduction && ".(js|css)$",
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  devServer: {
    stats: "minimal",
    overlay: true,
  },
};
