// 使用 inspirecloud 调用轻服务功能
import inspirecloud from '@byteinspire/api'
import { ITable } from '@byteinspire/db'

export type DirInfo = {
  name: string
  isDirectory: true
  path: string
  modified: Date
  children: Array<Child>
}

type Child = Omit<DirInfo, 'children'> | FileInfo

export type FileInfo = {
  name: string
  isDirectory: false
  path: string
  modified: Date
  mimetype: string
  size: number
}

export type Info = DirInfo | FileInfo

// 使用轻服务 todo 表
// 若用户未创建，在发送第一条调用时会自动创建该表
const infoTable: ITable<Info> = inspirecloud.db.table('info')

// 导出 table 实例
export default infoTable
