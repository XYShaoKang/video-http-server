// eslint-disable-next-line no-restricted-imports
import 'styled-components'

interface Character {
  fontFamily: string
  fontWeight: number
  fontSize: string
  lineHeight: number
  letterSpacing: string
}
declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: string
      secondary: string
      text: {
        primary: string
        secondary: string
        disabled: string
      }
    }
    typography: {
      h1: Character
      h2: Character
      h3: Character
      h4: Character
      h5: Character
      h6: Character
      body1: Character
      body2: Character
      default: Character
    }
  }
}
