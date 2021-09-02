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
 * @param rootPath Web 的根目录,绝对路径,用来定位当前路径
 * @param depth 遍历深度
 * @param currentPath 当前路径,绝对路径
 * @returns
 */
export function getInfo(
  rootPath: string,
  depth: number,
  currentPath: string
): Info {
  const relativePath = '/' + path.relative(rootPath, currentPath)
  const parentName = relativePath === '/' ? 'root' : path.basename(currentPath)

  const stat = fs.statSync(currentPath)

  const isDirectory = stat.isDirectory()
  let parentInfo: Info

  if (isDirectory) {
    const children = []

    if (depth > 0) {
      const tempList = fs.readdirSync(currentPath)

      for (let i = 0; i < tempList.length; i++) {
        const tempPath = path.join(currentPath, tempList[i])
        const info = getInfo(rootPath, depth--, tempPath)
        let child: Child = info
        if ('children' in info) {
          child = omit(['children'], info)
        } else if (!INLUDE_TYPEs.has(info.mimetype)) {
          // 过滤其他文件,只显示视频文件
          continue
        }

        children.push(child)
      }
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
