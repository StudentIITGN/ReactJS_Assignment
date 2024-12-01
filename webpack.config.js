require('dotenv').config({ path: `${__dirname}/.env` }); // http://bit.ly/2WE8EJP
const { NODE_ENV, DEV_SERVER_PORT, API, API_PORT, API_WEBPACK } = process.env;
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const AfterCompilePlugin = require('./after-compile-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

console.log(`
  +-----------------------------------+
  |                                   |
      NODE ENVIRONMENT: ${NODE_ENV}
  |                                   |
  +-----------------------------------+
`);

if (NODE_ENV === 'production') console.log('Building for production...\n\n');

module.exports = (env, argv) => ({
  // https://bit.ly/3awbwiG
  mode: env.prod ? 'production' : 'development',

  // http://bit.ly/2IEFVfK - fail on errors when building for production.
  bail: !!env.prod,

  /*
    http://bit.ly/2vZm5Ft
    The base directory, an absolute path, for resolving
    entry points and loaders from configuration.
  */
  context: path.resolve(__dirname, 'src'),

  /*
    http://bit.ly/2w3Ahxa
    The point(s) to enter the application.
  */
  entry: {
    /*
      This will produce a <srcipt src="main.js"> tag in the html.
      If you want to produce other separate tags, add them here.
      To order these script tags, see the `chunks` option of
      `HtmlWebpackPlugin` down below in the plugins section.
    */
    main: path.resolve(__dirname, 'src/entry.jsx'),
  },

  /*
    http://bit.ly/2JojX2u
    The top-level output key contains set of options instructing webpack
    on how and where it should output your bundles, assets and anything else
    you bundle or load with webpack.
  */
  output: {
    /*
      http://bit.ly/2KoIZP4
      This option determines the name of each output bundle.
    */
    filename: '[name].[fullhash].bundle.js',

    /*
      http://bit.ly/2MtdylV
    */
    chunkFilename: '[name].[fullhash].chunk.js',

    /*
      http://bit.ly/2KjYRSI
      The output directory as an absolute path.
    */
    path: path.resolve(__dirname, 'dist'),

    /*
      http://bit.ly/2Kmdcy1
      Adds helpful info in development when reading the generated code.
    */
    pathinfo: !env.prod,

    /*
      http://bit.ly/2KpiF75
      The URL of your `output.path` from the view of the HTML page.
      The value of the option is prefixed to every URL created by the runtime or loaders.
    */
    publicPath: '/',

    /*
      http://bit.ly/2IFBbGL
      http://bit.ly/33nRRub - PR in React codebase.
      The default global object is 'window'. To allow module chunks to work with
      web workers, a value of 'this' is used instead.
    */
    globalObject: 'this',
  },

  /*
    http://bit.ly/2KmfoWl
    These options determine how the different types of modules within a project will be treated.
  */
  module: {
    /*
      An array of Rules which are matched to requests when modules are created.
      These rules can modify how the module is created.
      They can apply loaders to the module, or modify the parser.
    */
    rules: [
      /*
        JAVASCRIPT
        ----------
        * ESx => ES5
        * JSX => ES5
      */
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false, // Needed for tree shaking to work (see above).
                    useBuiltIns: 'entry',
                    corejs: {
                      version: 3,
                      proposals: true,
                    },
                  },
                ],
                [
                  '@babel/preset-react',
                  { runtime: 'automatic' },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                !env.prod && 'react-refresh/babel',
              ].filter(Boolean),
            },
          },
        ],
      },

      /*
        SCSS
        ----
        * SCSS => CSS
        * Extract CSS from JS bundle => separate asset
        * Asset => <link> in index.html
      */
      {
        test: /\.(scss|css)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          !env.prod
            ? 'style-loader' // https://bit.ly/3aK3qTL
            : MiniCssExtractPlugin.loader, // http://bit.ly/2Kme3id
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // https://bit.ly/2WGQ9CZ
              sourceMap: false,
            },
          },
          env.prod && 'postcss-loader', // http://bit.ly/2WOusTr - needs to be *after* `css-loader`.
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ].filter(Boolean),
      },

      /*
        FONTS
        -----
        * Copies fonts found within the `src` tree to the `dist` folder
        * Keeps the original file name
      */
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },

      /*
        IMAGES
        ------
        * Copies fonts found within the `src` tree to the `dist` folder
        * Keeps the original file name
      */
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src/assets'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      helpers: path.resolve(__dirname, 'src/helpers')
    },
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },

  optimization: {
    minimize: !!env.prod,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !env.prod,
      __PROD__: env.prod,
      __API__: JSON.stringify(API),
      'process.env': {
        NODE_ENV: JSON.stringify(env.prod ? 'production' : 'development'),
      },
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
      chunkFilename: '[id].css',
    }),

    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['*.js', '*.css', '*.html'],
      cleanAfterEveryBuildPatterns: ['*.js', '*.css', '*.html'],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      title: '',
      mobileThemeColor: '#000000',
      description: '',
      minify: env.prod
        ? {
            collapseWhitespace: true,
            removeComments: true,
          }
        : false,
      chunks: ['main'],
      chunksSortMode: 'manual',
    }),

    !env.prod && new webpack.HotModuleReplacementPlugin(),
    !env.prod && new ReactRefreshWebpackPlugin(),

    !env.prod && new AfterCompilePlugin(),
  ].filter(Boolean),

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    open: true,
    port: DEV_SERVER_PORT,
    public: `http://localhost:${DEV_SERVER_PORT}`,
    proxy: API_WEBPACK
      ? {
          [API_WEBPACK]: {
            target: `http://localhost:${API_PORT}`,
            bypass(req, res, proxyOptions) {
              if (req.method.toLowerCase() === 'options') return res.sendStatus(200);
            },
          },
        }
      : {},
    watchOptions: {
      ignored: ['node_modules/**'],
    },
  },
});
