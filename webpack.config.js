const path = require("path"); //предустановленный плагин работы с путями
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

//находимся ли мы в режиме разработки
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (isProd)
    config.minimizer = [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  return config;
};

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, "css-loader"];
  if (extra) {
    loaders.push(extra);
  }
  loaders.push("postcss-loader");

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"), //папка исходников, __dirname - папка проекта
  mode: "development", //мод сборки "для разработки"
  entry: {
    main: ["@babel/polyfill", "./index.js"]
  }, //входные файлы
  output: {
    filename: filename("js"), //выходные файлы
    path: path.resolve(__dirname, "dist"), // папка для сборки
  },
  resolve: {
    //расширения по умолчанию, когда не указываем формат в import
    extensions: [".js", ".json"],
    alias: {
      //для облегчения импорта
      //import .... from "@models/....";
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core"),

    },
  },
  //оптимизация
  optimization: optimization(),

  devServer: {
    port: 4200,
    hot: isDev,
  },
  plugins: [
    //html-плагин
    new HTMLWebpackPlugin({
      template: "./index.html", //шаблон
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    //очистка папки сборки
    new CleanWebpackPlugin(),
    //копирование статических файлов
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/favicon.ico"),
    //       to: path.resolve(__dirname, "dist"),
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
  module: {
    rules: [
      //css
      {
        test: /\.css$/, //как только встречаем расширение css
        //исп. опр.тип лоадеров, справа налево
        // use: ["style-loader", "css-loader"],
        use: cssLoaders(),
      },
      //less
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      //sass
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      //images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      // {
      //   test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
      //   type: "asset/inline",
      // },
      // xml
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
      //csv
      {
        test: /\.csv$/,
        use: ["csv-loader"],
      },
      //babel-loader
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
          // plugins: [],
        },
      },
    ],
  },
  devtool: "source-map",
};
