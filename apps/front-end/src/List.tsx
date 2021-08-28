import React, { FC } from 'react'
import styled from 'styled-components/macro'
import Link from './Link'
import Typography from './Typography'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const ListHeaderWrap = styled.div`
  display: flex;
  height: 40px;
  box-shadow: 0px 1px 1px 0px #9e9e9e;
  align-items: center;
  padding: 0 20px;
  background: #f2f2f2;
`
const Header = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width ?? ''};
  padding-left: 10px;
`
const Body = styled.div`
  padding: 10px 20px 0;
`
const Row = styled.div<{ $showBackground: boolean }>`
  display: flex;
  height: 30px;
  align-items: center;
  background: ${({ $showBackground }) => ($showBackground ? '#f2f2f2' : '')};
  border-radius: 4px;
`
const Cell = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width ?? ''};
  padding-left: 10px;
`

type Field = 'name' | 'modified' | 'size' | 'mimetype'

const columns: Array<{ field: Field; name: string; width: number }> = [
  { field: 'name', name: 'Name', width: 190 },
  { field: 'modified', name: 'Date Modified', width: 260 },
  { field: 'size', name: 'Size', width: 150 },
  { field: 'mimetype', name: 'Kind', width: 170 },
]

interface ListProps {
  data: Array<{
    mimetype: string
    name: string
    path: string
    modified: string
    size?: number
    isDirectory?: boolean
  }>
}

const List: FC<ListProps> = ({ data }) => {
  return (
    <Container>
      <ListHeaderWrap>
        {columns.map(({ field, name, width }) => (
          <Header key={field} $width={`${width}px`}>
            <Typography>{name}</Typography>
          </Header>
        ))}
      </ListHeaderWrap>
      <Body>
        {data.map((item, i) => (
          <Row
            as={item.isDirectory ? Link : undefined}
            to={item.path}
            key={item.name}
            $showBackground={i % 2 === 0}
          >
            {columns.map(({ field, width }) => (
              <Cell key={field} $width={`${width}px`}>
                {item[field] ?? '--'}
              </Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Container>
  )
}

export default List
