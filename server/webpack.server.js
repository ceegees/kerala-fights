const nodeExternals = require('webpack-node-externals'),
    path = require('path'),
    srcPath = path.resolve(__dirname);
    


const env = process.env.NODE_ENV
let suffix = '';
if (env && env.toUpperCase() == 'PRODUCTION') {
    suffix= '.prod';
}

module.exports = {
  mode: env || 'development',
  entry: {
    server: './src/server.js'
  },
  output: {
    path: path.resolve(__dirname, 'views'),
    filename: "ssr.js",
    library: 'library',
    libraryTarget: 'umd'
  },
  target: 'node',
  node: {
      __dirname: false,
      __filename: false
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use : [
          {
          loader: "babel-loader" ,
            options: { 
              presets: ['es2015', 'react'], 
              plugins: ['transform-object-rest-spread'] 
            }
          }
        ]
      }
    ]
 },
 externals: nodeExternals(),
//  devtool: 'source-map'/

}
