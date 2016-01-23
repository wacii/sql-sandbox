module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: 'node_modules',
        query: { presets: ['es2015'] }
      },
      { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
    ]
  },
  eslint: {
    configFile: './.eslintrc'
  }
};
