const path = require('path');

module.exports = {
  entry: './public/app.js', // Change this to your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'production', // or 'development', depending on your needs
};