import React, { FC } from 'react'
import styled from 'styled-components/macro'

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

const App: FC = () => (
  <div>
    <Title>Hello world!</Title>
  </div>
)

export default App
