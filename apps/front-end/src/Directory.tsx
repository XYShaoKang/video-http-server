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
  mimetype: string
  name: string
  path: string
  modified: string
  size: number
}
interface DirectoryType {
  name: string
  path: string
  isDirectory: boolean
  modified: string
}

type ItemType = FileType | DirectoryType

type StateType = Array<{
  mimetype: string
  name: string
  path: string
  modified: string
  size?: number
  isDirectory?: boolean
}>

const Directory: FC = () => {
  const location = useLocation()
  const dirs = location.pathname.slice(1).split('/').filter(Boolean)
  dirs.unshift('root')

  const [data, setData] = useState<StateType>([])

  useEffect(() => {
    fetch(`/dir?relativePath=${location.pathname}`)
      .then(res => res.json())
      .then(({ msg, children }: { msg: string; children: Array<ItemType> }) => {
        if (msg === 'ok') {
          setData(
            children
              .map(item =>
                'isDirectory' in item ? { ...item, mimetype: 'Folder' } : item
              )
              .sort(a => ('isDirectory' in a ? -1 : 1))
          )
        } else {
          throw new Error('获取目录数据失败')
        }
      })
  }, [location.pathname])

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
      <List data={data} />
    </Container>
  )
}

export default Directory
