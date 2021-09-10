import React, { useState, MouseEventHandler } from 'react'
import { throttle } from './tools'

interface IUseHover {
  (
    enterFn: MouseEventHandler,
    moveFn: (e: MouseEvent) => void,
    leaveFn: (e: Event) => void
  ): [
    {
      x: number
      y: number
    },
    (enterEvent: React.MouseEvent<Element, MouseEvent>) => void
  ]
}

const useHover: IUseHover = (
  enterFn = _e => {
    //
  },
  moveFn = _e => {
    //
  },
  leaveFn = _e => {
    //
  }
) => {
  const [point, setPoint] = useState({ x: 0, y: 0 })

  const mouseEnterHandler = (
    enterEvent: React.MouseEvent<Element, MouseEvent>
  ) => {
    enterFn(enterEvent)
    const mouseMoveHandle = throttle(
      (moveEvent: MouseEvent) => {
        setPoint({ x: moveEvent.clientX + 10, y: moveEvent.clientY + 10 })
        moveFn(moveEvent)
      },
      { type: 'requestAnimationFrame' }
    )

    const mouseLeaveHandle = (leaveEvent: Event) => {
      leaveFn(leaveEvent)
      enterEvent.target.removeEventListener('mouseleave', mouseLeaveHandle)
      document.removeEventListener('mousemove', mouseMoveHandle)
    }

    enterEvent.target.addEventListener('mouseleave', mouseLeaveHandle)
    document.addEventListener('mousemove', mouseMoveHandle)
  }

  return [point, mouseEnterHandler]
}

export default useHover
