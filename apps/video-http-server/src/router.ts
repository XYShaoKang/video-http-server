import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import Router from '@koa/router'

const router = new Router()

const INLUDE_TYPEs = new Set(['video/mp4'])
const VIDEO_PATH = path.join(__dirname, '../videos/')

type DirInfo = {
  isDirectory: true
  children: Array<
    | { name: string; isDirectory: boolean }
    | { name: string; type: string; relativePath: string }
  >
}

type FileInfo = {
  isDirectory: false
  mimetype: string
  filename: string
  size: number
}

type Info = DirInfo | FileInfo

function getInfo(absolutePath: string): Info {
  const stat = fs.statSync(absolutePath)
  const list = []
  const isDirectory = stat.isDirectory()
  if (isDirectory) {
    const tempList = fs.readdirSync(absolutePath)
    for (let i = 0; i < tempList.length; i++) {
      const tempPath = path.join(absolutePath, tempList[i])
      const stat = fs.statSync(tempPath)
      if (stat.isDirectory()) {
        list.push({
          name: tempList[i],
          isDirectory: true,
        })
      } else {
        const type = mime.lookup(tempPath)
        if (type && INLUDE_TYPEs.has(type)) {
          list.push({
            name: tempList[i],
            type,
            relativePath: '/' + path.relative(VIDEO_PATH, tempPath),
          })
        }
      }
    }

    return { isDirectory, children: list }
  } else {
    const filename = path.basename(absolutePath)
    const mimetype = mime.contentType(filename) || 'application/octet-stream'
    return { isDirectory, mimetype, filename, size: stat.size }
  }
}

router.get('/dir', async (ctx, _next) => {
  const { relativePath } = ctx.query
  if (relativePath && typeof relativePath === 'string') {
    const absolutePath = path.join(VIDEO_PATH, relativePath)
    const info = getInfo(absolutePath)
    if (info.isDirectory) {
      ctx.response.body = {
        msg: 'ok',
        children: info.children,
      }
    } else {
      ctx.response.body = {
        error: 'not is directory',
      }
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
    const absolutePath = path.join(VIDEO_PATH, relativePath)
    const info = getInfo(absolutePath)
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

export { router }
