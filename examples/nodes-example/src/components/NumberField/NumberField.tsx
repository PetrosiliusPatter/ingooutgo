import { FieldComponent } from "@ingooutgo/react"
import * as React from "react"

import { numberSchema } from "../../schemas"
import { StyledNumberInput } from "./styles"

type NumberFieldProps = {
  schema: typeof numberSchema
}

export const createNumberField: (
  props: NumberFieldProps
) => FieldComponent<typeof numberSchema> =
  ({ schema }) =>
  ({ updateFunc, value, disabled }) => {
    return (
      <StyledNumberInput
        disabled={disabled}
        value={value}
        onChange={updateFunc}
        min={schema?.minValue ?? undefined}
        max={schema?.maxValue ?? undefined}
        stepHoldDelay={500}
        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        precision={schema?.isInt ? 0 : 2}
      />
    )
  }
