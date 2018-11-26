const webpack = require('webpack');

module.exports = {
  title: 'React native activity feeds - Docs',
  require: ['babel-polyfill'],
  styleguideDir: 'docs',
  sortProps: (props) => props,
  sections: [
    {
      name: 'Introduction',
      content: 'docs/setup.md',
    },
    {
      name: 'Top Level Components',
      content: 'docs/top-level-components.md',
      components: [
        'src/components/FlatFeed.js',
        'src/components/NotificationFeed.js',
        'src/components/SinglePost.js',
        'src/Context.js',
      ],
      exampleMode: 'collapse',
      usageMode: 'expand',
    },
    {
      name: 'UI Components',
      content: 'docs/other-components.md',
      components: 'src/components/[A-Z]*.js',
      ignore: [
        '**/FlatFeed.js',
        '**/NotificationFeed.js',
        '**/SinglePost.js',
        '**/CommentsContainer.js',
      ],
      exampleMode: 'collapse',
      usageMode: 'expand',
    },
    {
      name: 'Cookbook',
      content: 'docs/cookbook.md',
    },
    {
      name: 'Styles',
      content: 'docs/styles.md',
    },
  ],
  template: {
    favicon: 'https://getstream.imgix.net/images/favicons/favicon-96x96.png',
  },
  webpackConfig: {
    resolve: {
      // auto resolves any react-native import as react-native-web
      alias: { 'react-native': 'react-native-web' },
      extensions: ['.web.js', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            plugins: ['react-native-web'],
            presets: ['react-native'],
            babelrc: false,
          },
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                hash: 'sha512',
                digest: 'hex',
                name: '[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.ttf$/,
          loader: 'file-loader',
        },
      ],
    },
    // Most react native projects will need some extra plugin configuration.
    plugins: [
      // Add __DEV__ flag to browser example.
      new webpack.DefinePlugin({
        __DEV__: process.env,
      }),
    ],
  },
};
