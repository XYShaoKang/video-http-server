import { FC } from 'react'
import styled from 'styled-components/macro'

type Component =
  | 'span'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'div'
  | 'button'
type Variant = 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const StyledDefaultText = styled.p<{ $variant: Variant; $color: string }>`
  color: ${({ $color, theme }) => $color ?? theme.palette.text.primary};
  font-family: ${props =>
    props.theme.typography[props?.$variant ?? 'default'].fontFamily};
  font-size: ${props =>
    props.theme.typography[props?.$variant ?? 'default'].fontSize};
  font-weight: ${props =>
    props.theme.typography[props?.$variant ?? 'default'].fontWeight};
  line-height: ${props =>
    props.theme.typography[props?.$variant ?? 'default'].lineHeight};
  letter-spacing: ${props =>
    props.theme.typography[props?.$variant ?? 'default'].letterSpacing};
`

const variantMapping = (key: Variant) => {
  const map: { [key: string]: Component } = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
  }

  return map[key]
}

interface TypographyProps {
  component?: Component | React.ComponentType<any>
  variant?: Variant
  color?: string
}

const Typography: FC<TypographyProps> = ({
  component,
  variant = 'body1',
  color,
  ...props
}) => {
  return (
    <StyledDefaultText
      as={component ?? variantMapping(variant)}
      $variant={variant}
      $color={color}
      {...props}
    />
  )
}

export default Typography
