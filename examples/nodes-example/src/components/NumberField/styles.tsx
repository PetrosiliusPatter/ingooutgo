import { NumberInput } from "@mantine/core"
import styled from "styled-components"

export const StyledNumberInput = styled(NumberInput)`
  width: 100%;

  .mantine-NumberInput-input {
    background-color: var(--color-input-background);
    color: var(--color-text);
    border-color: transparent;
    :hover {
      background-color: var(--color-node-background-lighter);
    }
  }
  .mantine-NumberInput-controlUp,
  .mantine-NumberInput-controlDown {
    background-color: var(--color-node-background-lighter);
    color: var(--color-text);
    border-color: transparent;
    cursor: pointer;
    :hover {
      background-color: var(--color-node-background-lighter);
      color: var(--color-selection);
    }
  }
  .mantine-NumberInput-input {
    border-color: var(--color-input-border);
  }
`
