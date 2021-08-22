import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { merge } from 'webpack-merge'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
}

/**
 * @type {import('webpack').Configuration}
 */
const productionConfig = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [new CleanWebpackPlugin()],
  devtool: 'source-map',
  mode: 'production',
}

/**
 * @type {import('webpack').Configuration}
 */
const developmentConfig = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
    open: true,
    hot: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devtool: 'eval-source-map',
  mode: 'development',
}

export default (_env, _args) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return merge(commonConfig, developmentConfig)
    case 'production':
      return merge(commonConfig, productionConfig)
    default:
      throw new Error('No matching configuration was found!')
  }
}
