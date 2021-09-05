import Router from '@koa/router'
import infoController from '../controllers/infoController'

// Koa 的路由在被 use 时是无法指定前缀的, 需要在定义时就指定前缀
const router = new Router({
  prefix: '/info',
})

// // 组装路由
router.get('/', infoController.getInfo)
// router.get('/init', infoController.init)

// Koa 的路由需要调用 routes 函数获取实际用于 use 的函数
export default router.routes()
