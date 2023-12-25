import { FieldComponent } from "../../deps/ingooutgo.ts"
import { React } from "../../deps/react.ts"
import { z } from "../../deps/zod.ts"

import { StyledTextInput } from "./styles.ts"

export const TextField: FieldComponent<z.ZodString> = ({ updateFunc, value, disabled }) => (
  <StyledTextInput
  type="text"
    disabled={disabled}
    value={value ?? ""}
    onChange={(e) => updateFunc?.(e.target.value)}
  />
)
