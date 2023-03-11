import { FieldComponent } from "@ingooutgo/react"
import * as React from "react"

import { stringSchema } from "../../schemas"
import { StyledTextInput } from "./styles"

export const createTextField: () => FieldComponent<typeof stringSchema> =
  () =>
  ({ updateFunc, value, disabled }) => {
    return (
      <StyledTextInput
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => updateFunc?.(e.target.value)}
      />
    )
  }
