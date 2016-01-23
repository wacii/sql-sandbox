module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  loaders: [
    {
      loader: 'babel',
      exclude: 'node_modules',
      query: { presets: ['es2015'] }
    }
  ]
};
