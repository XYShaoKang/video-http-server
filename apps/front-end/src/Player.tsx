import { FC, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import XGPlayer from 'xgplayer'

import { FileType } from './hooks/useInfo'

const PlayerWrap = styled.div`
  width: 100%;
  height: 100%;
`

const PlayerRoot = styled.div`
  padding: 10px 30px 0;
`

interface ErrorType {
  info: FileType
}

const Player: FC<ErrorType> = ({ info }) => {
  const ref = useRef(null)
  useEffect(() => {
    let player: XGPlayer
    if (info && ref.current) {
      player = new XGPlayer({
        el: ref.current,
        url: `/file?relativePath=${info.path}`,
        fluid: true,
      })
    }
    return () => {
      player.destroy(false)
    }
  }, [])

  return (
    <PlayerWrap>
      <PlayerRoot>
        <div ref={ref} />
      </PlayerRoot>
    </PlayerWrap>
  )
}

export default Player
