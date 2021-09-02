import fs from 'fs'
import path from 'path'
import Router from '@koa/router'
import { curry } from 'ramda'

import { getInfo } from './getInfo'

function createRoute(rootPath: string): Router {
  const router = new Router()
  const depth = 1
  const getInfoWithVideoPath = curry(getInfo)(rootPath)(depth)

  router.get('/info', async (ctx, _next) => {
    const { relativePath } = ctx.query
    if (relativePath && typeof relativePath === 'string') {
      const absolutePath = path.join(rootPath, relativePath)
      const info = getInfoWithVideoPath(absolutePath)
      ctx.response.body = {
        msg: 'ok',
        info,
      }
    } else {
      ctx.response.body = {
        error: 'lack relativePath',
      }
    }
  })

  router.get('/file', async (ctx, _next) => {
    const { relativePath } = ctx.query
    if (relativePath && typeof relativePath === 'string') {
      const absolutePath = path.join(rootPath, relativePath)
      const info = getInfoWithVideoPath(absolutePath)
      if (info.isDirectory) {
        ctx.response.body = {
          error: 'not is file',
        }
      } else {
        const { mimetype, size } = info
        const range = ctx.header.range
        let start = 0,
          end = size - 1,
          chunksize = size
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-')
          start = parseInt(parts[0], 10)
          end = parts[1] ? parseInt(parts[1], 10) : size - 1
          chunksize = end - start + 1
          ctx.status = 206
          ctx.set('Content-Range', `bytes ${start}-${end}/${size}`)
        } else {
          ctx.status = 200
        }
        ctx.set('Content-Type', mimetype)
        ctx.set('Accept-Ranges', 'bytes')
        ctx.set('Content-Length', String(chunksize))
        ctx.body = fs.createReadStream(absolutePath, { start, end })
      }
    } else {
      ctx.response.body = {
        error: 'lack relativePath',
      }
    }
  })

  return router
}

export { createRoute }
