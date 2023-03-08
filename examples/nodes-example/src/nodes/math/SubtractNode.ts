import { Input, Output, Node } from "@ingooutgo/core"
import { NodeRegistration } from "@ingooutgo/react"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"
import { numberSchema } from "../../schemas"

class SubtractNodeClass extends Node {
  name: string = "Subtract"

  inputs = {
    a: new Input({
      name: "A",
      type: numberSchema,
      defaultValue: 1,
      component: createNumberField({ schema: numberSchema }),
    }),
    b: new Input({
      name: "B",
      type: numberSchema,
      defaultValue: 1,
      component: createNumberField({ schema: numberSchema }),
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: numberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum - value))
      ),
      component: createNumberField({ schema: numberSchema }),
    }),
  }

  accentColor = "#2596be"
  icon = "MathSymbols"
}

export const subtractNode: NodeRegistration = {
  id: "math/subtract",
  name: "Subtract",
  create: () => new SubtractNodeClass(),
}
