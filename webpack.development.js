const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map", // Show the source map so we can debug when developing locally
  devServer: {
    host: "localhost",
    port: "40992",
    hot: true, // Hot-reload this server if changes are detected
    compress: true, // Compress (gzip) files that are served        
    static: {
      directory: path.resolve(__dirname, "app/dist"), // Where we serve the local dev server's files from
      watch: true, // Watch the directory for changes
      staticOptions: {
        ignored: /node_modules/ // Ignore this path, probably not needed since we define directory above
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/src/index.html"),
      filename: "index.html"
    }),
    
    new CspHtmlWebpackPlugin({
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "https://api.openai.com/v1/chat/completions"],
      "style-src": ["'self'", "'unsafe-eval'", /*"'unsafe-inline'",*/ "'unsafe-hashes'",
      "'sha256-BCpnf71gZdCsSCHDzyB1RsBbZ0qQdqseK6v+yJsgg30='",
      "'sha256-io1cubr8M3cYl5FCyjKN7PYudmj8FPk6GgH/ja6EeOo='",
      "'sha256-BZbd3sNVZo05Chje1pmwuHKXHu1X6laHBGQxUzjkxjE='",
      "'sha256-dQ2AxSQ4REabLHyw+DAG55A+oxWvwMK7jd/uG7fV1EU='",
      "'sha256-nga9RGMJyBm/Iqp0FH5UX9+og2Qb4bDtYs2WHl6juuk='",
      "'sha256-ysOwxBJdd3IFYrdfUfQOvYB45bQ2cyH2ptcv+ZrKeas='",
      "'sha256-ey4JlZuWcrtqSi3+trECYIHmX4k/DOgbeq0gQiD7/no='",
      "'sha256-XnfUjLlIYA4VjFL5Jap4t8PYNiiU8LwTWWhBwaH1zxs='",
      "'sha256-XnfUjLlIYA4VjFL5Jap4t8PYNiiU8LwTWWhBwaH1zxs='",
      "'sha256-0EZqoz+oBhx7gF4nvY2bSqoGyy4zLjNF+SDQXGp/ZrY='"], // Added 'unsafe-inline', 'unsafe-hashes' and removed nonce values from the style-src directive
      "frame-src": ["'none'"],
      "worker-src": ["'none'"]
    })
  
  ],
  resolve: {
    fallback: {
      fs: false
    }
  }
})