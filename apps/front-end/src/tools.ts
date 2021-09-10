type ThrottleOption =
  | {
      type: 'setTimeout'
      time: number
    }
  | {
      type: 'requestAnimationFrame'
    }

const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  option: ThrottleOption
): ((...args: T) => void) => {
  let tag = true
  return (...args: T) => {
    if (tag) {
      tag = false
      fn(...args)
      if (option.type === 'setTimeout') {
        setTimeout(() => {
          tag = true
        }, option.time)
      } else {
        requestAnimationFrame(() => {
          tag = true
        })
      }
    }
  }
}

export { throttle }
