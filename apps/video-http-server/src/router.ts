import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import Router from '@koa/router'
import { curry, omit } from 'ramda'

const router = new Router()

const INLUDE_TYPEs = new Set(['video/mp4'])
const ROOT_PATH = path.join(__dirname, '../videos/')

type DirInfo = {
  name: string
  isDirectory: true
  path: string
  modified: Date
  children: Array<Child>
}

type Child = Omit<DirInfo, 'children'> | FileInfo

type FileInfo = {
  name: string
  isDirectory: false
  path: string
  modified: Date
  mimetype: string
  size: number
}

type Info = DirInfo | FileInfo

/**
 *
 * @param parentPath 当前路径,相对路径
 * @returns
 */
export function getInfo(rootPath: string, parentPath: string): Info {
  const relativePath = '/' + path.relative(rootPath, parentPath)
  const parentName = relativePath === '/' ? 'root' : path.basename(parentPath)

  const stat = fs.statSync(parentPath)

  const isDirectory = stat.isDirectory()
  let parentInfo: Info

  if (isDirectory) {
    const children = []
    const tempList = fs.readdirSync(parentPath)

    for (let i = 0; i < tempList.length; i++) {
      const tempPath = path.join(parentPath, tempList[i])
      const info = getInfo(rootPath, tempPath)
      let child: Child = info
      if ('children' in info) {
        child = omit(['children'], info)
      } else if (!INLUDE_TYPEs.has(info.mimetype)) {
        // 过滤其他文件,只显示视频文件
        continue
      }

      children.push(child)
    }
    parentInfo = {
      name: parentName,
      isDirectory: true,
      path: relativePath,
      modified: stat.mtime,
      children,
    }
  } else {
    parentInfo = {
      name: parentName,
      isDirectory: false,
      path: relativePath,
      modified: stat.mtime,
      mimetype: mime.contentType(parentName) || 'application/octet-stream',
      size: stat.size,
    }
  }

  return parentInfo
}

export const getInfoWithVideoPath = curry(getInfo)(ROOT_PATH)

router.get('/info', async (ctx, _next) => {
  const { relativePath } = ctx.query
  if (relativePath && typeof relativePath === 'string') {
    const absolutePath = path.join(ROOT_PATH, relativePath)
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
    const absolutePath = path.join(ROOT_PATH, relativePath)
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

export { router }
