import styled from "styled-components"

type GProps = {
  selected?: boolean
}

export const StyledG = styled.g<GProps>`
  stroke: ${({ selected }) =>
    selected ? "var(--color-connection-selection)" : "var(--color-connection)"};
`
