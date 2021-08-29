import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { useLocation } from 'react-router-dom'

import Nav from './Nav'
import Link from './Link'
import List from './List'

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
  const location = useLocation()
  const dirs = location.pathname.slice(1).split('/').filter(Boolean)
  dirs.unshift('root')

  const [children, setChildren] = useState<StateType>([])
  const [currentInfo, setCurrentInfo] = useState<FileType | DirectoryType>()

  useEffect(() => {
    fetch(`/info?relativePath=${location.pathname}`)
      .then(res => res.json())
      .then(({ msg, info }: { msg: string; info: ItemInfo }) => {
        if (msg === 'ok') {
          const { children, ...tempInfo } = info
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
        } else {
          throw new Error('获取目录数据失败')
        }
      })
  }, [location.pathname])

  return (
    <Container>
      <Header>
        {currentInfo && (
          <Nav>
            {dirs.map((name, i) => (
              <Link to={dirs.slice(1, i + 1).join('/')} key={i}>
                {name}
              </Link>
            ))}
          </Nav>
        )}
      </Header>
      {currentInfo?.isDirectory && <List data={children} />}
    </Container>
  )
}

export default Directory
