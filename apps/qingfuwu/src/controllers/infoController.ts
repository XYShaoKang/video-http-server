import Koa from 'koa'
import { DirInfo, FileInfo } from '../models/infoTable'
import infoService from '../services/infoService'

/**
 * InfoController
 * Controller 是业务入口，由 HTTP 路由解析后调用
 * 包含待办事项的增删改查功能
 */
class InfoController {
  /**
   * 列出所有 info
   * 响应格式
   * {
   *   list: [info1, info2]
   * }
   * @param ctx Koa 的上下文参数
   */
  async listAll(ctx: Koa.Context) {
    const list = await infoService.listAll()
    ctx.body = { list }
  }

  /**
   * 删除一条 info 信息
   * 响应格式
   * {
   *   ok: true
   * }
   * @param ctx Koa 的上下文参数
   */
  async delete(ctx: Koa.Context) {
    await infoService.delete(ctx.params.id)
    ctx.body = { ok: true }
  }

  /**
   * 删除所有 info 信息
   * 响应格式
   * {
   *   ok: true
   * }
   * @param ctx Koa 的上下文参数
   */
  async deleteAll(ctx: Koa.Context) {
    await infoService.deleteAll()
    ctx.body = { ok: true }
  }

  /**
   * 查询一条 info 信息
   * 响应格式
   * {
   *   ok: true
   * }
   * @param ctx Koa 的上下文参数
   */
  async getInfo(ctx: Koa.Context) {
    const { relativePath } = ctx.request.query

    if (relativePath && typeof relativePath === 'string') {
      const info = await infoService.getInfo(relativePath)

      ctx.body = { msg: 'ok', info }
    }
  }

  /**
   * 查询一条 info 信息
   * 响应格式
   * {
   *   ok: true
   * }
   * @param ctx Koa 的上下文参数
   */
  async init(_ctx: Koa.Context) {
    const initData = [
      {
        name: 'root',
        isDirectory: true as const,
        path: '/',
        modified: new Date(),
        children: [
          {
            name: 'temp',
            isDirectory: true as const,
            path: '/temp',
            modified: new Date(),
            children: [],
          },
          {
            name: 'demo.mp4',
            isDirectory: false as const,
            path: '/demo.mp4',
            modified: new Date(),
            mimetype: 'video/mp4',
            size: 12228098,
          },
        ],
      },
    ]
    init(initData)
  }
}
type DirInfo1 = DirInfo & { children: Array<DirInfo1 | FileInfo> }
async function init(
  initData: Array<DirInfo1 | FileInfo>
): Promise<Array<DirInfo1>> {
  const infos: Array<DirInfo1> = []
  for (const item of initData) {
    if (item.isDirectory) {
      const _infos = await init(item.children)

      const info = await infoService.create({ ...item, children: _infos })
      infos.push(info as DirInfo1)
    } else {
      const info = await infoService.create(item)
      infos.push(info as DirInfo1)
    }
  }
  return infos
}

// 导出 Controller 的实例
export default new InfoController()
