import path from 'path'
import { fileURLToPath } from 'url'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

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
    /**
     *
     * @param {import('webpack-dev-server')} devServer
     */
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      const STATIC_PATH = path.join(__dirname, '../static')

      devServer.app.get('/dir', function (req, res) {
        const { relativePath } = req.query
        if (relativePath === '/') {
          res.json({
            msg: 'ok',
            children: [
              {
                name: 'demo.mp4',
                mimetype: 'video/mp4,',
                path: '/demo.mp4',
              },
            ],
          })
        } else {
          res.json({
            error: 'no found directory',
          })
        }
      })
      devServer.app.get('/file', function (req, res) {
        const { relativePath } = req.query
        if (relativePath === '/demo.mp4') {
          const fileName = path.join(STATIC_PATH, relativePath)
          res.sendFile(fileName)
        } else {
          res.json({
            error: 'no found file',
          })
        }
      })
    },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devtool: 'eval-source-map',
  mode: 'development',
}

export { development }
