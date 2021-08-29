import { useState, useEffect } from 'react'

export interface FileType {
  name: string
  isDirectory: false
  path: string
  modified: string
  mimetype: string
  size: number
}
export interface DirectoryType {
  name: string
  isDirectory: true
  path: string
  modified: string
}

export type ItemType = FileType | DirectoryType

type ItemInfo = ItemType & { children?: Array<ItemType> }
export interface StatType {
  name: string
  isDirectory: boolean
  path: string
  modified: string
  mimetype: string
  size?: number
}

const useInfo = (
  pathname: string
): {
  currentInfo: ItemType | undefined
  error: string | undefined
  children: Array<StatType>
} => {
  const [currentInfo, setCurrentInfo] = useState<ItemType>()
  const [error, setError] = useState<string>()
  const [children, setChildren] = useState<Array<StatType>>([])

  useEffect(() => {
    fetch(`/info?relativePath=${pathname}`)
      .then(res => res.json())
      .then(
        (
          data:
            | {
                msg: string
                info: ItemInfo
              }
            | { error: string }
        ) => {
          if ('msg' in data && data.msg === 'ok') {
            const { children, ...tempInfo } = data.info
            if (children) {
              setChildren(
                children
                  .map(item =>
                    item.isDirectory ? { ...item, mimetype: 'Folder' } : item
                  )
                  .sort(a => (a.isDirectory ? -1 : 1))
              )
            }
            setCurrentInfo(tempInfo)
            setError(undefined)
          } else if ('error' in data) {
            setError(`获取 ${pathname} 目录数据失败,请检查路径`)
          }
        }
      )
  }, [pathname])

  return {
    currentInfo,
    error,
    children,
  }
}
export default useInfo
