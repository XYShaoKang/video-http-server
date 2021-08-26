import { CleanWebpackPlugin } from 'clean-webpack-plugin'

/**
 * @type {import('webpack').Configuration}
 */
const production = {
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

export { production }
