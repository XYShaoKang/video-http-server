import request from 'supertest'
import Koa from 'koa'
import http from 'http'
import path from 'path'
import mock, { directory, file } from 'mock-fs'
import { Buffer } from 'buffer'
import { Console } from 'console'

import { router, getInfoWithVideoPath } from './router'

// https://github.com/tschaub/mock-fs/issues/234#issuecomment-703740305
// eslint-disable-next-line no-global-assign
console = new Console(process.stdout, process.stderr)

const demoStat = {
  ctime: new Date(),
  size: 3,
  content: Buffer.from([0x6d, 0x70, 0x34]),
}

beforeEach(() => {
  mock({
    videos: directory({
      mtime: demoStat.ctime,
      items: {
        temp: directory({
          mtime: demoStat.ctime,
          items: {
            'demo1.mp4': file({
              content: demoStat.content,
              mtime: demoStat.ctime,
            }),
          },
        }),
        'demo.mp4': file({
          content: demoStat.content,
          mtime: demoStat.ctime,
        }),
      },
    }),
  })
})

afterEach(() => {
  mock.restore()
})

test('getInfoWithVideoPath', async () => {
  const info = getInfoWithVideoPath(path.join(__dirname, '../videos/'))
  process.stdout.write(typeof info.modified + '\n')
  expect(info).toEqual({
    name: 'root',
    isDirectory: true,
    path: '/',
    modified: demoStat.ctime,
    children: [
      {
        name: 'demo.mp4',
        isDirectory: false,
        path: '/demo.mp4',
        modified: demoStat.ctime,
        mimetype: 'video/mp4',
        size: demoStat.size,
      },
      {
        name: 'temp',
        isDirectory: true,
        path: '/temp',
        modified: demoStat.ctime,
      },
    ],
  })
})

test('route dir info', async () => {
  const app = new Koa()
  app.use(router.routes())

  const response = await request(http.createServer(app.callback())).get(
    '/info?relativePath=/'
  )

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  )
  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    msg: 'ok',
    info: {
      name: 'root',
      isDirectory: true,
      path: '/',
      modified: demoStat.ctime.toISOString(),
      children: [
        {
          name: 'demo.mp4',
          isDirectory: false,
          path: '/demo.mp4',
          modified: demoStat.ctime.toISOString(),
          mimetype: 'video/mp4',
          size: demoStat.size,
        },
        {
          name: 'temp',
          isDirectory: true,
          path: '/temp',
          modified: demoStat.ctime.toISOString(),
        },
      ],
    },
  })
})

test('route file info', async () => {
  const app = new Koa()
  app.use(router.routes())

  const response = await request(http.createServer(app.callback())).get(
    '/info?relativePath=/demo.mp4'
  )

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  )
  expect(response.status).toBe(200)
  expect(response.body).toEqual({
    msg: 'ok',
    info: {
      name: 'demo.mp4',
      isDirectory: false,
      path: '/demo.mp4',
      modified: demoStat.ctime.toISOString(),
      mimetype: 'video/mp4',
      size: demoStat.size,
    },
  })
})
