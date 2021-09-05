import infoTable, { Info } from '../models/infoTable'
import inspirecloud from '@byteinspire/api'

const ObjectId = inspirecloud.db.ObjectId
/**
 * InfoService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含 Info 的增删改查功能
 */
class InfoService {
  /**
   * 列出所有 info
   */
  async listAll() {
    const all = await infoTable.where().find()
    return all
  }

  /**
   * 创建一条 info 信息
   * @param info 用于创建 info 的数据，原样存进数据库
   * @return {Promise<Info>} 返回实际插入数据库的数据，会增加_id，createdAt和updatedAt字段
   */
  async create(info: Info) {
    return await infoTable.save(info)
  }

  /**
   * 删除一条 info 信息
   * @param id info 的 _id
   * 若不存在，则抛出 404 错误
   */
  async delete(id: string) {
    const { result } = await infoTable.where({ _id: new ObjectId(id) }).delete()
    if (result.deletedCount === 0) {
      const error = new Error(`info:${id} not found`)

      throw { ...error, status: 404 }
    }
  }

  /**
   * 删除所有 info 信息
   */
  async deleteAll() {
    await infoTable.where().delete()
  }

  /**
   * 更新一条 info 信息
   * @param id info 的 _id
   * @param updater 将会用原对象 merge 此对象进行更新
   * 若不存在，则抛出 404 错误
   */
  async update(id: string, updater: Info) {
    const todo = await infoTable.where({ _id: new ObjectId(id) }).findOne()
    if (!todo) {
      const error = new Error(`info:${id} not found`)

      throw { ...error, status: 404 }
    }
    Object.assign(todo, updater)
    await infoTable.save(todo)
  }

  async getInfo(path: string) {
    return await infoTable
      .where({ path })
      // TODO: 修复类型
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .populate('children' as any)
      .findOne()
  }
}

// 导出 Service 的实例
export default new InfoService()
