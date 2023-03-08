import { TextInput } from "@mantine/core"
import styled from "styled-components"

export const StyledTextInput = styled(TextInput)`
  width: 100%;

  .mantine-TextInput-input {
    background-color: var(--color-input-background);
    color: var(--color-text);
    border-color: transparent;
    :hover {
      background-color: var(--color-input-background-lighter);
    }
  }
  .mantine-TextInput-controlUp,
  .mantine-TextInput-controlDown {
    background-color: var(--color-input-background-lighter);
    color: var(--color-text);
    border-color: transparent;
    cursor: pointer;
    :hover {
      background-color: var(--color-input-background-lighter);
      color: var(--color-selection);
    }
  }
  .mantine-TextInput-input {
    border-color: var(--color-input-border);
  }
`
