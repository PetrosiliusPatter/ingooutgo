import { FieldComponent } from "../../deps/ingooutgo.ts"
import { React } from "../../deps/react.ts"
import { z } from "../../deps/zod.ts"

import { StyledNumberInput } from "./styles.ts"

type NumberFieldProps = {
  zodNumber: z.ZodNumber
}

export const createNumberField: (
  props: NumberFieldProps,
) => FieldComponent<z.ZodNumber> =
  ({ zodNumber }) => ({ updateFunc, value, disabled }) => (
    <StyledNumberInput
      type="number"
      disabled={disabled}
      value={value ?? ""}
      onChange={(v) => {
        const num = Number(v.target.value)
        if (Number.isNaN(num)) return
        updateFunc?.(num)
      }}
      min={zodNumber?.minValue ?? undefined}
      max={zodNumber?.maxValue ?? undefined}
    />
  )
