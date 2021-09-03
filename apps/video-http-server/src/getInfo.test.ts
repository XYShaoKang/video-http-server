import path from 'path'
import mock, { directory, file } from 'mock-fs'
import { Buffer } from 'buffer'

import { getInfo } from './getInfo'

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

test('getInfo', async () => {
  const info = getInfo(
    path.join(__dirname, '../videos/'),
    1,
    path.join(__dirname, '../videos/')
  )

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
