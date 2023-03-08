import { Node, Input, Output } from "@ingooutgo/core"
import { NodeRegistration } from "@ingooutgo/react"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"
import { numberSchema } from "../../schemas"

class AddNodeClass extends Node {
  name: string = "Add"

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
      name: "Output2",
      type: numberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value))
      ),
      component: createNumberField({ schema: numberSchema }),
    }),
  }

  accentColor = "#2596be"
  icon = "MathSymbols"
}

export const addNode: NodeRegistration = {
  id: "math/add",
  name: "Add",
  create: () => new AddNodeClass(),
}
