import { combineLatest, map } from "../../deps/rxjs.ts"
import { NodeRegistration } from "../../deps/ingooutgo.ts"
import { Input, Node, Output } from "../../deps/nodl.ts"
import { z } from "../../deps/zod.ts"

import { createNumberField } from "../../components/NumberField/NumberField.tsx"
import { numberSchema } from "../../schemas.ts"

class SubtractNode extends Node {
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
        map((inputs) => inputs.reduce((sum, value) => sum - value)),
      ),
    }),
  }
}

export const subtractNodeRegistration = new NodeRegistration({
  id: "ingooutgo/nodes-example/math/subtract",
  name: "Subtract",
  node: SubtractNode,
  fieldExtras: {
    a: { component: createNumberField({ zodNumber: z.number() }) },
    b: { component: createNumberField({ zodNumber: z.number() }) },
    output: { component: createNumberField({ zodNumber: z.number() }) },
  },
  accentColor: "#2596be",
  icon: "MathSymbols",
})
