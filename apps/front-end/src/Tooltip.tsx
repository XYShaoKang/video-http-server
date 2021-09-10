import styled from 'styled-components/macro'

const Tooltip = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: #808080;
  padding: 0 5px;
  color: aliceblue;
  border-radius: 4px;
`
export default Tooltip
