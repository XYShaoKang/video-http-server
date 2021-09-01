import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import os from 'os'
import chalk from 'chalk'
import path from 'path'

import { createServer } from './server'
import { extractIpv4Address, print } from './utils'

const ifaces = os.networkInterfaces()

const DEFAULT_PORT = 9011
const DEFAULT_HOST = '0.0.0.0'

yargs(hideBin(process.argv))
  .options({
    root: {
      default: './',
      describe: 'root path',
      string: true,
    },
    port: {
      alias: 'p',
      default: DEFAULT_PORT,
      describe: 'server port',
      number: true,
    },
    host: {
      alias: 'h',
      default: DEFAULT_HOST,
      describe: 'server host',
      string: true,
    },
  })
  .command<{ host: string; port: number; root: string }>(
    ['server [root]', '$0'],
    '启动一个视频服务器',
    () => {
      //
    },
    ({ host, port, root = '' }) => {
      const rootPath = path.join(process.cwd(), root)

      const server = createServer(rootPath)

      server.on('close', () => {
        // console.log('server close')
      })

      server.listen(port, host, () => {
        print(chalk.green('Server running on \n'))

        const logUrl = (address: string | undefined) =>
          address && print(`    http://${address}:${port}`)
        if (host === '0.0.0.0') {
          extractIpv4Address(ifaces).forEach(logUrl)
        } else {
          logUrl(host)
        }

        print('\nHit CTRL-C to stop the server')
      })

      const closeHandle = () => {
        print(chalk.red('video-http-server stopped'), true)
        server.close()
      }

      process.on('SIGINT', closeHandle)
      process.on('SIGTERM', closeHandle)
      process.on('SIGUSR1', closeHandle)
      process.on('SIGUSR2', closeHandle)
      process.on('uncaughtException', closeHandle)
    }
  )
  .strict()
  .help().argv
