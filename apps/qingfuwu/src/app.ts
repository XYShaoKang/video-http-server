import path from 'path'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import infoRouter from './routers/info'
import fileRouter from './routers/file'
import Koa from 'koa'

const app = new Koa()

const CLIENT_PATH = path.join(__dirname, '../public')

// 为应用使用中间件
// 静态文件中间件
app.use(koaStatic(CLIENT_PATH))
// 请求体 parse 中间件，用于 parse json 格式请求体
app.use(koaBody())

interface CustomError {
  status: number
  message: string
}

function assertCustomError(err: unknown): asserts err is CustomError {
  if (err && (err as CustomError).status && (err as CustomError).message) {
    return
  }
  throw err
}

/** 若后面的路由抛错，则封装为错误响应返回
 * 错误响应格式为
 * {
 *   error: message
 * }
 */
app.use(async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err: unknown) {
    // 抛出的错误可以附带 status 字段，代表 http 状态码
    // 若没有提供，则默认状态码为 500，代表服务器内部错误

    assertCustomError(err)
    ctx.status = err.status || 500
    ctx.body = { error: err?.message }
  }
})

// 为应用使用路由定义
// 使用待办事项业务路由
app.use(infoRouter)
app.use(fileRouter)

// 不匹配的路由重定向到 index.html 交由客户端路由处理
app.use(
  async (ctx, next) =>
    await koaStatic(CLIENT_PATH)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
)

module.exports = app
