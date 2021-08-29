import React, { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { defaultTheme } from './theme'

import Main from './Main'

const App: FC = () => (
  <div>
    <Routes>
      <ThemeProvider theme={defaultTheme}>
        <Route path="/*" element={<Main />} />
      </ThemeProvider>
    </Routes>
  </div>
)

export default App
