import Koa from 'koa'
import Router from '@koa/router'
import inspirecloud from '@byteinspire/api'
import { ITable } from '@byteinspire/db'
import axios from 'axios'

type File = {
  name: string
  size: number
  type: string
  url: string
  path: string
}

const fileTable: ITable<File> = inspirecloud.db.table('_file')

// Koa 的路由在被 use 时是无法指定前缀的, 需要在定义时就指定前缀
const router = new Router({
  prefix: '/file',
})

// // 组装路由
router.get('/', async (ctx: Koa.Context) => {
  const { relativePath } = ctx.request.query
  if (relativePath && typeof relativePath === 'string') {
    const file = await fileTable.where({ path: relativePath }).findOne()

    if (file) {
      const { url, type, size } = file
      ctx.set('Content-Type', type)
      ctx.set('Content-Length', String(size))
      return await axios({ method: 'get', url, responseType: 'stream' }).then(
        res => {
          ctx.body = res.data
        }
      )
    }
  }

  const error = new Error(`file:${relativePath} not found`)

  throw { ...error, status: 404 }
})

// Koa 的路由需要调用 routes 函数获取实际用于 use 的函数
export default router.routes()
