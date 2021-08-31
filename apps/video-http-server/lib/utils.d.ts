/// <reference types="node" />
import os from 'os'
export declare const extractIpv4Address: (
  x: NodeJS.Dict<os.NetworkInterfaceInfo[]>
) => Array<string | undefined>
export declare const clearConsole: () => void
export declare const print: (str: string, clear?: boolean | undefined) => void
