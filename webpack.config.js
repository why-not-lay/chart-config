const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir){
  return path.join(__dirname, dir);
}
resolve("src")

module.exports = {
  mode: "development",
  entry: {
    chartConfig: "./src/component/configPlatform/index.js",
    chartShower: "./src/component/chartShower/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  plugins: [
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
