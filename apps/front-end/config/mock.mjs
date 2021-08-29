import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const STATIC_PATH = path.join(__dirname, '../static')
const demoStat = fs.statSync(path.join(STATIC_PATH, 'demo.mp4'))
const infos = {
  '/': {
    msg: 'ok',
    info: {
      name: 'root',
      isDirectory: true,
      path: '/',
      modified: demoStat.ctime,
      children: [
        {
          name: 'demo.mp4',
          isDirectory: false,
          path: '/demo.mp4',
          modified: demoStat.ctime,
          mimetype: 'video/mp4',
          size: demoStat.size,
        },
        {
          name: 'temp',
          isDirectory: true,
          path: '/temp',
          modified: demoStat.ctime,
        },
      ],
    },
  },
  '/temp': {
    msg: 'ok',
    info: {
      name: 'root',
      isDirectory: true,
      path: '/temp',
      modified: demoStat.ctime,
      children: [
        {
          name: 'demo.mp4',
          isDirectory: false,
          path: '/temp/demo.mp4',
          modified: demoStat.ctime,
          mimetype: 'video/mp4',
          size: demoStat.size,
        },
      ],
    },
  },
  '/demo.mp4': {
    msg: 'ok',
    info: {
      name: 'demo.mp4',
      isDirectory: false,
      path: '/demo.mp4',
      modified: demoStat.ctime,
      mimetype: 'video/mp4',
      size: demoStat.size,
    },
  },
  '/temp/demo.mp4': {
    msg: 'ok',
    info: {
      name: 'demo.mp4',
      isDirectory: false,
      path: '/temp/demo.mp4',
      modified: demoStat.ctime,
      mimetype: 'video/mp4',
      size: demoStat.size,
    },
  },
}

const beforeSetupMiddleware = function (devServer) {
  if (!devServer) {
    throw new Error('webpack-dev-server is not defined')
  }

  devServer.app.get('/info', function (req, res) {
    const { relativePath } = req.query
    const info = infos[relativePath]
    if (info) {
      res.json(info)
    } else {
      res.json({
        error: 'no found path',
      })
    }
  })
  devServer.app.get('/file', function (req, res) {
    const { relativePath } = req.query
    const filename = path.basename(relativePath)
    if (filename.toLocaleLowerCase() === 'demo.mp4') {
      const filePath = path.join(STATIC_PATH, 'demo.mp4')
      res.sendFile(filePath)
    } else {
      res.json({
        error: 'no found file',
      })
    }
  })
}

export { beforeSetupMiddleware }
