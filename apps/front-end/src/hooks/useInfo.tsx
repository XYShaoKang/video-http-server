import { useState, useEffect } from 'react'

interface FileType {
  name: string
  isDirectory: false
  path: string
  modified: string
  mimetype: string
  size: number
}
interface DirectoryType {
  name: string
  isDirectory: true
  path: string
  modified: string
}

type ItemInfo = (FileType | DirectoryType) & {
  children?: Array<FileType | DirectoryType>
}

type StateType = Array<{
  name: string
  isDirectory: boolean
  path: string
  modified: string
  mimetype: string
  size?: number
}>

const useInfo = (
  pathname: string
): {
  currentInfo: FileType | DirectoryType | undefined
  error: string | undefined
  children: StateType
} => {
  const [currentInfo, setCurrentInfo] = useState<FileType | DirectoryType>()
  const [error, setError] = useState<string>()
  const [children, setChildren] = useState<StateType>([])

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
