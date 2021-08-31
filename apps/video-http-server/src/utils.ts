import os from 'os'
import { filter, flatten, map, path, pipe, values } from 'ramda'
import logUpdate from 'log-update'

const filterIpv4 = filter<os.NetworkInterfaceInfo | undefined, 'array'>(
  network => network?.family.toLowerCase() === 'ipv4'
)

export const extractIpv4Address: (
  x: NodeJS.Dict<os.NetworkInterfaceInfo[]>
) => Array<string | undefined> = pipe(
  values,
  flatten,
  filterIpv4,
  map(path(['address']))
)

export const clearConsole = (): void => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

let logStr = ''

const logUpdatePrint = (str: string, clear?: boolean): void => {
  if (clear) {
    logStr = str
  } else {
    logStr += str
  }
  logUpdate(logStr)
}

export const print = (str: string, clear?: boolean): void => {
  if (process.env.TS_NODE_DEV || process.env.VSCODE_BUGGER) {
    // 开发模式下,使用 `console.log` 来输出
    console.log(str)
  } else {
    logUpdatePrint(str + '\n', clear)
  }
}
