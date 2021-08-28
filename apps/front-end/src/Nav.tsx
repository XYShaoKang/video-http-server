import React, { Children, FC, ReactElement } from 'react'
import styled from 'styled-components/macro'
import Typography from './Typography'

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
`

const Separator = styled(Typography)`
  margin: 0 5px;
`

const Nav: FC = ({ children }) => {
  return (
    <nav>
      <List>
        {Children.toArray(children).reduce<Array<ReactElement>>(
          (arr, Item, i) =>
            arr.concat(
              i > 0 ? (
                <li key={i - 0.5}>
                  <Separator>&gt;</Separator>
                </li>
              ) : (
                []
              ),
              <li key={i}>{Item}</li>
            ),
          []
        )}
      </List>
    </nav>
  )
}

export default Nav
