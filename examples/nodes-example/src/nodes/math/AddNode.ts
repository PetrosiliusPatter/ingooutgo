import { NodeRegistration } from "@ingooutgo/react"
import { Input, Output, Node } from "@nodl/core"
import { combineLatest, map } from "rxjs"

import { createNumberField } from "../../components/NumberField"
import { numberSchema } from "../../schemas"

class AddNode extends Node {
  inputs = {
    a: new Input({
      name: "A",
      type: numberSchema,
      defaultValue: 1,
    }),
    b: new Input({
      name: "B",
      type: numberSchema,
      defaultValue: 1,
    }),
  }

  outputs = {
    output: new Output({
      name: "Output",
      type: numberSchema,
      observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
        map((inputs) => inputs.reduce((sum, value) => sum + value))
      ),
    }),
  }
}

export const addNodeRegistraion = new NodeRegistration({
  id: "string/add",
  name: "Add",
  node: AddNode,
  components: {
    a: createNumberField({ schema: numberSchema }),
    b: createNumberField({ schema: numberSchema }),
    output: createNumberField({ schema: numberSchema }),
  },
  accentColor: "#2596be",
  icon: "MathSymbols",
})
