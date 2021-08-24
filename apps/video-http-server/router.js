const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const Router = require('@koa/router')

const router = new Router()

const INLUDE_TYPEs = new Set(['video/mp4'])
const VIDEO_PATH = path.join(__dirname, './videos/')

function getInfo(absolutePath) {
  const stat = fs.statSync(absolutePath)
  let list = []
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
        if (INLUDE_TYPEs.has(type)) {
          list.push({
            name: tempList[i],
            type,
            relativePath: '/' + path.relative(VIDEO_PATH, tempPath),
          })
        }
      }
    }

    return { isDirectory, list }
  } else {
    const filename = path.basename(absolutePath)
    const mimetype = mime.contentType(filename)
    return { isDirectory, mimetype, filename, size: stat.size }
  }
}

router.get('/dir', async (ctx, next) => {
  const { relativePath } = ctx.query
  if (relativePath) {
    const absolutePath = path.join(VIDEO_PATH, relativePath)
    const { isDirectory, list } = getInfo(absolutePath)
    if (isDirectory) {
      ctx.response.body = {
        msg: 'ok',
        list,
      }
    } else {
      ctx.response.body = {
        error: 'not is directory',
      }
    }
  } else {
    ctx.response.body = {
      msg: 'lack relativePath',
    }
  }
})

router.get('/file', async (ctx, next) => {
  const { relativePath } = ctx.query
  if (relativePath) {
    const absolutePath = path.join(VIDEO_PATH, relativePath)
    const { isDirectory, mimetype, filename, size } = getInfo(absolutePath)
    if (isDirectory) {
      ctx.response.body = {
        error: 'not is file',
      }
    } else {
      let range = ctx.header.range,
        start = 0,
        end = size - 1,
        chunksize = size
      if (range) {
        let parts = range.replace(/bytes=/, '').split('-')
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
      ctx.set('Content-Length', chunksize)
      ctx.body = fs.createReadStream(absolutePath, { start, end })
    }
  } else {
    ctx.response.body = {
      msg: 'lack relativePath',
    }
  }
})

module.exports = { router }
