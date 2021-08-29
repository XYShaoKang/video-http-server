import path from 'path'
import { fileURLToPath } from 'url'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { beforeSetupMiddleware } from './mock.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * @type {import('webpack').Configuration}
 */
const development = {
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    port: 9000,
    open: true,
    hot: true,
    historyApiFallback: { disableDotRule: true },
    /**
     *
     * @param {import('webpack-dev-server')} devServer
     */
    onBeforeSetupMiddleware: beforeSetupMiddleware,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devtool: 'eval-source-map',
  mode: 'development',
}

export { development }
