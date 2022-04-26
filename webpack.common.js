const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir){
  return path.join(__dirname, dir);
}

module.exports = {
  entry: {
    chartConfig: "./src/component/configPlatform/index.js",
    chartShower: "./src/component/chartShower/index.js",
    chartSelect: "./src/component/chartSelect/index.js",
    chartLogin: "./src/component/chartLogin/index.js",
    vendors: ["react", "antd"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          //test: /[\\/]node_modules[\\/]/,
          name: "common",
          chunks: "initial",
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "图表设置",
      template: "./src/index.html",
      filename: "chartSelect.html",
      chunks: ["chartSelect"],
    }),
    new HtmlWebpackPlugin({
      title: "图表配置",
      template: "./src/index.html",
      filename: "chartConfig.html",
      chunks: ["chartConfig"],
    }),
    new HtmlWebpackPlugin({
      title: "图表展示",
      template: "./src/index.html",
      filename: "chartShower.html",
      chunks: ["chartShower"],
    }),
    new HtmlWebpackPlugin({
      title: "图表登录",
      template: "./src/index.html",
      filename: "chartLogin.html",
      chunks: ["chartLogin"],
    })
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: [resolve("src")],
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [resolve("src")],
        use: ["style-loader", "css-loader"],
        type: "asset/resource"
      }
    ]
  }
};
