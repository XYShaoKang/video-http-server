import { FC, ComponentProps } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Typography from './Typography'

const StyledLink = styled(Typography)`
  font-weight: bold;
  text-decoration: none;
  & :hover {
    text-decoration: underline;
  }
`

const Link: FC<ComponentProps<typeof RouterLink>> = props => {
  return <StyledLink component={RouterLink} {...props} />
}

export default Link
