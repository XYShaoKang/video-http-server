import { FC } from 'react'
import styled from 'styled-components/macro'
import Typography from './Typography'

const ErrorWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface ErrorType {
  msg: string
}

const Error: FC<ErrorType> = ({ msg }) => {
  return (
    <ErrorWrap>
      <Typography variant="h4">{msg}</Typography>
    </ErrorWrap>
  )
}

export default Error
