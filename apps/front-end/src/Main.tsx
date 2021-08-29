import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { useLocation } from 'react-router-dom'

import Nav from './Nav'
import Link from './Link'
import List from './List'
import Error from './Error'

const Container = styled.div`
  width: 800px;
  height: 600px;
  box-shadow: 1px 4px 6px 2px #9e9e9e;
`
const Header = styled.div`
  display: flex;
  height: 40px;
  position: relative;
  box-shadow: 0px 1px 1px 0px #9e9e9e;
  align-items: center;
  padding-left: 20px;
  background: #f2f2f2;
`

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

const Directory: FC = () => {
  const { pathname } = useLocation()

  const [children, setChildren] = useState<StateType>([])
  const [currentInfo, setCurrentInfo] = useState<FileType | DirectoryType>()
  const [error, setError] = useState<string>()

  const path = error ? pathname : currentInfo?.path

  const dirs = path?.slice(1).split('/').filter(Boolean) ?? []
  dirs.unshift('root')

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

  return (
    <Container>
      <Header>
        <Nav>
          {dirs.map((name, i) => (
            <Link to={dirs.slice(1, i + 1).join('/')} key={i}>
              {name}
            </Link>
          ))}
        </Nav>
      </Header>
      {currentInfo?.isDirectory && <List data={children} />}
      {error && <Error msg={error} />}
    </Container>
  )
}

export default Directory
