import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

it('App render', async () => {
  const spiedFetch = jest.spyOn(window, 'fetch')
  spiedFetch
    .mockResolvedValueOnce(
      Promise.resolve(
        new Response(
          `{"msg":"ok","children":[{"name":"demo.mp4","mimetype":"video/mp4","path":"/demo.mp4","modified":"2021-08-26T13:27:41.750Z","size":12228098},{"name":"temp","isDirectory":true,"path":"/temp","modified":"2021-08-26T13:27:41.750Z"}]}`,
          { status: 200, headers: { 'Content-type': 'application/json' } }
        )
      )
    )
    .mockResolvedValueOnce(
      Promise.resolve(
        new Response(`{"msg":"ok","children":[]}`, {
          status: 200,
          headers: { 'Content-type': 'application/json' },
        })
      )
    )

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  await waitFor(() => {
    expect(screen.getByText(/root/i)).toBeInTheDocument()
    expect(screen.getByText(/temp/i)).toBeInTheDocument()
  })

  userEvent.click(screen.getByText(/temp/i))

  await waitFor(() => {
    expect(screen.getByText(/temp/i)).toBeInTheDocument()
  })
  expect(screen.queryByText(/demo\.mp4/i)).not.toBeInTheDocument()
})
