import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import http from 'http'

import { createRoute } from './router'

const CLIENT_PATH = path.join(__dirname, '../../front-end/dist/')

function createApp(rootPath: string): Koa {
  // const ROOT_PATH = path.join(__dirname, '../videos/')
  const router = createRoute(rootPath)

  const app = new Koa()

  app.use(bodyParser())
  app.use(serve(CLIENT_PATH))
  app.use(router.routes()).use(router.allowedMethods())

  app.on('error', error => {
    // TODO: 暂时先使用警告来代替错误
    // https://github.com/koajs/koa/issues/1089
    if (error.code === 'EPIPE') {
      console.warn('Koa app-level EPIPE error.', { error })
    } else {
      console.error('Koa app-level error', { error })
    }
  })
  return app
}

function createServer(rootPath: string): http.Server {
  const app = createApp(rootPath)
  const server = http.createServer(app.callback())
  return server
}

export { createApp, createServer }
