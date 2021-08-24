import path from 'path'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import { router } from './router'

const CLIENT_PATH = path.join(__dirname, '../../front-end/dist/')
const PORT = 3000

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
