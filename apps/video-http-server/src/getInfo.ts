import path from 'path'
import fs from 'fs'
import mime from 'mime-types'
import { omit } from 'ramda'

const INLUDE_TYPEs = new Set(['video/mp4'])

export type DirInfo = {
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
