import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import Link from './Link'
import Typography from './Typography'
import { StatType } from './hooks/useInfo'
import Tooltip from './Tooltip'
import { throttle } from './tools'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  height: 100%;
  padding: 10px 20px 0;
  overflow-y: auto;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

type Field = 'name' | 'modified' | 'size' | 'mimetype'

const columns: Array<{ field: Field; name: string; width: number }> = [
  { field: 'name', name: 'Name', width: 190 },
  { field: 'modified', name: 'Date Modified', width: 260 },
  { field: 'size', name: 'Size', width: 150 },
  { field: 'mimetype', name: 'Kind', width: 170 },
]

interface ListProps {
  data: Array<StatType>
}

const List: FC<ListProps> = ({ data }) => {
  const [hoverText, setHoverText] = useState('')
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const mouseMoveHandleRef = useRef<(moveEvent: MouseEvent) => void | null>()

  useEffect(() => {
    setHoverText('')
    setPoint({ x: 0, y: 0 })
    if (mouseMoveHandleRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandleRef.current)
      mouseMoveHandleRef.current = undefined
    }
  }, [data])

  const createMouseEnterHandler = (
    field: Field,
    item: StatType
  ): React.MouseEventHandler | undefined => {
    if (field === 'name') {
      return enterEvent => {
        setHoverText(item[field])

        const mouseMoveHandle = throttle(
          (moveEvent: MouseEvent) => {
            setPoint({ x: moveEvent.clientX + 10, y: moveEvent.clientY + 10 })
          },
          { type: 'requestAnimationFrame' }
        )
        mouseMoveHandleRef.current = mouseMoveHandle

        const mouseLeaveHandle = (_leaveEvent: Event) => {
          setHoverText('')
          enterEvent.target.removeEventListener('mouseleave', mouseLeaveHandle)
          document.removeEventListener('mousemove', mouseMoveHandle)
        }

        enterEvent.target.addEventListener('mouseleave', mouseLeaveHandle)
        document.addEventListener('mousemove', mouseMoveHandle)
      }
    }
  }

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
            as={Link}
            to={item.path}
            key={item.name}
            $showBackground={i % 2 === 0}
          >
            {columns.map(({ field, width }) => (
              <Cell
                key={field}
                $width={`${width}px`}
                onMouseEnter={createMouseEnterHandler(field, item)}
              >
                {item[field] ?? '--'}
              </Cell>
            ))}
          </Row>
        ))}
      </Body>
      {hoverText && <Tooltip {...point}>{hoverText}</Tooltip>}
    </Container>
  )
}

export default List
