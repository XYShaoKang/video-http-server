import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { useLocation } from 'react-router-dom'

import Nav from './Nav'
import Link from './Link'
import List from './List'
import Error from './Error'
import Player from './Player'
import useInfo from './hooks/useInfo'

const Container = styled.div`
  width: 800px;
  height: 600px;
  box-shadow: 1px 4px 6px 2px #9e9e9e;
  display: flex;
  flex-direction: column;
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

const Directory: FC = () => {
  const { pathname } = useLocation()

  const { children, currentInfo, error } = useInfo(pathname)

  const path = error ? pathname : currentInfo?.path

  const dirs = path?.slice(1).split('/').filter(Boolean) ?? []
  dirs.unshift('root')

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
      {currentInfo &&
        (currentInfo.isDirectory ? (
          <List data={children} />
        ) : (
          <Player info={currentInfo} />
        ))}
      {error && <Error msg={error} />}
    </Container>
  )
}

export default Directory
