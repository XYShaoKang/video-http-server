import React, { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components/macro'
import { defaultTheme } from './theme'

import Directory from './Directory'

const App: FC = () => (
  <div>
    <Routes>
      <ThemeProvider theme={defaultTheme}>
        <Route path="/*" element={<Directory />} />
      </ThemeProvider>
    </Routes>
  </div>
)

export default App
